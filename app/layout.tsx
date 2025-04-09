// app/layout.tsx
export const metadata = {
  title: 'JLPT N5 퀴즈',
  description: '간단한 일본어 단어 퀴즈 앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
