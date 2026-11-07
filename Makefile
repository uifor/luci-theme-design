# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Design Theme
LUCI_DEPENDS:=+luci-base
PKG_VERSION:=8.0
PKG_RELEASE:=20261107

LUCI_MINIFY_CSS:=
CONFIG_LUCI_CSSTIDY:=

define Package/luci-theme-design/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Design
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
