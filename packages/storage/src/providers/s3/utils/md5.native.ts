// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Md5 } from '@smithy/md5-js';
import { toBase64 } from './client/utils';

export const calculateContentMd5 = async (
	content: Blob | string | ArrayBuffer | ArrayBufferView
): Promise<string> => {
	const hasher = new Md5();
	if (typeof content === 'string') {
		hasher.update(content);
	} else if (ArrayBuffer.isView(content) || content instanceof ArrayBuffer) {
		const blob = new Blob([content]);
		const buffer = await readFile(blob);
		hasher.update(buffer);
	} else {
		const buffer = await readFile(content);
		hasher.update(buffer);
	}
	const digest = await hasher.digest();
	return toBase64(digest);
};

const readFile = (file: Blob): Promise<ArrayBuffer> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (reader.result) {
				resolve(reader.result as ArrayBuffer);
			}
			reader.onabort = () => reject(new Error('Read aborted'));
			reader.onerror = () => reject(reader.error);
		};
		if (file !== undefined) reader.readAsArrayBuffer(file);
	});
};
