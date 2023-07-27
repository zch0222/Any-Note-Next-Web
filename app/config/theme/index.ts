// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
    token: {
        fontSize: 14,
        colorPrimary: '#01B96B',
    },
};

export const dashboardSiderTheme:ThemeConfig = {
    components: {
        Menu: {
            itemBg: 'rgba(239, 239, 239, 0)',
            itemSelectedColor: 'white',
            itemActiveBg: '#01B96B',
            colorItemBgSelected: '#01B96B'
        },
        Input: {
            colorBgContainer: '#EFEFEF'
        }
    }
}
