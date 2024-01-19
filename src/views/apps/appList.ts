import { AppDto } from '../../apis/dtos';

export const appList1: AppDto[] = '000000'.split('').map(
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

export const getTotalBadge = () => {};

export const getChildrenBadge = (items: AppDto[]): number => {
  return items.reduce((partialSum, n) => partialSum + (n.badge || 0), 0);
};

export const appList: AppDto[] = [
  {
    name: '报表',
    children: [
      {
        name: '员工花名册',
        style: {
          //   color: 'pink',
          backgroundColor: 'pink',
        },
      },
      {
        name: '预估门店盈亏',
        style: {
          //   color: 'pink',
          backgroundColor: 'red',
        },
      },
      {
        name: '现金收入',
        style: {
          //   color: 'pink',
          backgroundColor: 'orange',
        },
      },
    ],
  },
  {
    name: '商城设置',
    children: [
      {
        name: '积分上架',
        style: {
          //   color: 'pink',
          backgroundColor: 'green',
        },
      },
      {
        name: '活动审批',
        style: {
          //   color: 'pink',
          backgroundColor: 'cyan',
        },
      },
      {
        name: '退货退款申请',
        style: {
          //   color: 'pink',
          backgroundColor: 'purple',
        },
      },
    ],
  },
  {
    name: '数字日春',
    children: [
      {
        name: '待办事项',
        style: {
          //   color: 'pink',
          backgroundColor: 'yellowgreen',
        },
      },
      {
        name: '附近门店',
        style: {
          //   color: 'pink',
          backgroundColor: 'gold',
        },
      },
      {
        name: '附近门店',
        style: {
          //   color: 'pink',
          backgroundColor: 'chartreuse',
        },
      },
      {
        name: '附近门店',
        style: {
          //   color: 'pink',
          backgroundColor: 'brown',
        },
        badge: 3,
      },
    ],
  },
  {
    name: '市场',
    children: [
      {
        name: 'chocolate',
        style: {
          //   color: 'pink',
          backgroundColor: 'chocolate',
        },
      },
      {
        name: '附近palegreen门店',
        style: {
          //   color: 'pink',
          backgroundColor: 'palegreen',
        },
      },
      {
        name: 'palevioletred',
        style: {
          //   color: 'pink',
          backgroundColor: 'palevioletred',
        },
      },
      {
        name: 'yellow',
        style: {
          //   color: 'pink',
          backgroundColor: 'yellow',
        },
        isDot: true,
      },
      {
        name: 'skyblue',
        style: {
          //   color: 'pink',
          backgroundColor: 'skyblue',
        },
      },
      {
        name: 'cornsilk',
        style: {
          //   color: 'pink',
          backgroundColor: 'cornsilk',
        },
      },
      {
        name: 'cornflowerblue',
        style: {
          //   color: 'pink',
          backgroundColor: 'cornflowerblue',
        },
      },
    ],
  },
];
