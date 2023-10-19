// theme/themeConfig.ts
import type {ThemeConfig} from 'antd';

export const theme: ThemeConfig = {
    token: {
        fontSize: 14,
        colorPrimary: '#01B96B',
    },
    components: {
        Table: {
            colorBgContainer: "#FBFBFB"
        }
    }
};

export const dashboardSiderTheme: ThemeConfig = {
    components: {
        Menu: {
            itemBg: 'rgba(239, 239, 239, 0)',
            // itemSelectedColor: "rgb(211, 235, 220)",
            itemActiveBg: '#01B96B',
            // colorItemBgSelected: '#01B96B'
        },
        Input: {
            colorBgContainer: '#EFEFEF'
        }
    }
}
