import { AppDto } from '../../apis/dtos';

export const appList: AppDto[] = '000000'.split('').map(
  (g, i) =>
    <AppDto>{
      name: `Group1- ${i}`,
      children: '00000000'.split('').map(
        (x, j) =>
          <AppDto>{
            name: `App- ${j}`,
            imageUrl: 'https://m.rctea.com/mobile/images/precomposed.png',
          },
      ),
    },
);
