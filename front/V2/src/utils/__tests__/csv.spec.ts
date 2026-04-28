import { buildCsvText, parseCsvText } from '@/utils/csv';

describe('csv utils', () => {
  it('parses simple csv text and builds escaped csv text', () => {
    expect(parseCsvText('name,email\n系统管理员,admin@example.com')).toEqual([
      {
        name: '系统管理员',
        email: 'admin@example.com',
      },
    ]);

    expect(
      buildCsvText([
        {
          name: '运营,编辑',
          email: 'editor@example.com',
        },
      ]),
    ).toBe('name,email\n"运营,编辑",editor@example.com');
  });
});
