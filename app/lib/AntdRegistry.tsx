// 注意：const cache = createCache(); 需要移到函数外，不然在引用 menu 组件，页面跳转的时候会报错【仅在打包后的生产环境可现】。
'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
const cache = createCache();

const StyledComponentsRegistry = ({ children }: { children: React.ReactNode }) => {
    useServerInsertedHTML(() => <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />);
    return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
