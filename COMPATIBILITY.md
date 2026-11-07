# 版本兼容性说明

## 支持的 OpenWrt 版本

本主题 8.x 版本面向以下 OpenWrt 版本：

- ✅ **OpenWrt 25.12.x** - 8.x 版本支持，使用原生 ucode 模板和 APK 构建

OpenWrt 21/23/24.x 请使用 7.x 及更早版本。8.x 不再包含旧版本 Lua 模板。

> 8.x 版本不再包含 Lua `.htm` 模板，仅支持 OpenWrt 25.12.x 的 ucode LuCI 运行时。

## 主要兼容性改进

### 1. LuCI API
- 使用 OpenWrt 25.12 原生 ucode 模板
- 服务端通过 `ubus.call()` 获取系统信息
- 使用 `dispatcher.lang`、`ctx.path`、`ctx.authsession` 和 `version` 等原生模板作用域

### 2. JavaScript 依赖
- 菜单模块使用 LuCI 25.12 的原生 `L.env` 和 `ui.menu` 接口
- 主题保留 jQuery，仅用于现有移动端和插件样式兼容代码

### 3. 资源加载
- 静态资源位于 `/www/luci-static/design/`
- ucode 模板位于 `/usr/share/ucode/luci/template/themes/design/`

## 已知问题

### OpenWrt 25.12 特定问题
1. 某些第三方插件可能需要单独适配
2. 如果遇到菜单显示问题，请清除浏览器缓存

## 测试建议

编译安装后，请测试以下功能：
- [ ] 登录界面显示正常
- [ ] 主菜单展开/收起
- [ ] 移动端响应式布局
- [ ] 深色模式切换
- [ ] 各插件页面样式

## 反馈问题

如果在特定版本遇到问题，请提供：
1. OpenWrt 版本号
2. LuCI 版本号
3. 浏览器类型和版本
4. 具体问题截图

## 技术细节

### ucode 模板
服务端模板位于 `ucode/template/themes/design/`，由 LuCI 安装到 `/usr/share/ucode/luci/template/themes/design/`。
