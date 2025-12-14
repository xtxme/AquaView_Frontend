'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({
  children,
}: {
  children: ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    return <>{styles}</>;
  });

  useEffect(
    () => () => {
      styledComponentsStyleSheet.seal();
    },
    [styledComponentsStyleSheet],
  );

  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
