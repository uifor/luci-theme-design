'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
	__init__() {
		ui.menu.load().then(tree => this.render(tree));
	},

	render(tree) {
		let node = tree;
		let url = '';

		this.renderModeMenu(tree);

		const dispatchpath = L.env.dispatchpath || [];
		if (dispatchpath.length >= 3) {
			for (let i = 0; i < 3 && node; i++) {
				node = node.children[dispatchpath[i]];
				url += (url ? '/' : '') + dispatchpath[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}

		const showSideBtn = document.querySelector('.showSide');
		const darkMask = document.querySelector('.darkMask');

		if (showSideBtn)
			showSideBtn.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));

		if (darkMask)
			darkMask.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));

		const loadingEl = document.querySelector('.main > .loading');
		if (loadingEl) {
			loadingEl.style.opacity = '0';
			loadingEl.style.visibility = 'hidden';
		}

		if (window.innerWidth <= 992) {
			const mainLeft = document.querySelector('.main-left');
			if (mainLeft)
				mainLeft.style.width = '0';
		}

		const mainRight = document.querySelector('.main-right');
		if (mainRight)
			mainRight.style.overflow = 'auto';

		window.addEventListener('resize', this.handleSidebarToggle, true);
	},

	handleMenuExpand(ev) {
		const a = ev.target;
		const slideMenu = a.nextElementSibling;
		let collapse = false;

		document.querySelectorAll('.main .main-left .nav > li > ul.active').forEach(ul => {
			if (ul === slideMenu)
				collapse = true;

			ul.style.display = 'none';
			ul.classList.remove('active');
			if (ul.previousElementSibling)
				ul.previousElementSibling.classList.remove('active');
		});

		if (!slideMenu || collapse)
			return;

		slideMenu.style.display = 'block';
		slideMenu.classList.add('active');
		a.classList.add('active');
		a.blur();

		ev.preventDefault();
		ev.stopPropagation();
	},

	renderMainMenu(tree, url, level) {
		const l = (level || 0) + 1;
		const ul = E('ul', { 'class': level ? 'slide-menu' : 'nav' });
		const children = ui.menu.getChildren(tree);

		if (children.length === 0 || l > 2)
			return E([]);

		children.forEach(child => {
			const isActive = L.env.dispatchpath[l] === child.name;
			const submenu = this.renderMainMenu(child, url + '/' + child.name, l);
			const hasChildren = submenu.children.length > 0;
			let slideClass = hasChildren ? 'slide' : '';
			let menuClass = hasChildren ? 'menu' : '';

			if (isActive) {
				ul.classList.add('active');
				slideClass += ' active';
				menuClass += ' active';
			}

			ul.appendChild(E('li', { 'class': slideClass }, [
				E('a', {
					'href': L.url(url, child.name),
					'click': (l === 1 && hasChildren) ? ui.createHandlerFn(this, 'handleMenuExpand') : null,
					'class': menuClass || null,
					'data-title': child.title.replace(' ', '_')
				}, [_(child.title)]),
				submenu
			]));
		});

		if (l === 1) {
			const container = document.querySelector('#mainmenu');
			if (container) {
				container.appendChild(ul);
				container.style.display = '';
			}
		}

		return ul;
	},

	renderModeMenu(tree) {
		const ul = document.querySelector('#modemenu');
		if (!ul)
			return;

		const children = ui.menu.getChildren(tree);
		const requestpath = L.env.requestpath || [];

		children.forEach((child, index) => {
			const isActive = requestpath.length ? child.name === requestpath[0] : index === 0;

			ul.appendChild(E('li', {}, [
				E('a', {
					'href': L.url(child.name),
					'class': isActive ? 'active' : null
				}, [_(child.title)])
			]));

			if (isActive)
				this.renderMainMenu(child, child.name);

			if (index > 0 && index < children.length - 1)
				ul.appendChild(E('li', { 'class': 'divider' }, [E('span')]));
		});

		if (children.length > 1 && ul.parentElement)
			ul.parentElement.style.display = '';
	},

	renderTabMenu(tree, url, level) {
		const container = document.querySelector('#tabmenu');
		const l = (level || 0) + 1;
		const ul = E('ul', { 'class': 'tabs' });
		const children = ui.menu.getChildren(tree);
		let activeNode = null;

		if (!container || children.length === 0)
			return E([]);

		children.forEach(child => {
			const isActive = L.env.dispatchpath[l + 2] === child.name;
			const activeClass = isActive ? ' active' : '';

			ul.appendChild(E('li', {
				'class': 'tabmenu-item-%s%s'.format(child.name, activeClass)
			}, [
				E('a', { 'href': L.url(url, child.name) }, [_(child.title)])
			]));

			if (isActive)
				activeNode = child;
		});

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			container.appendChild(this.renderTabMenu(activeNode, url + '/' + activeNode.name, l));

		return ul;
	},

	handleSidebarToggle(ev) {
		const width = window.innerWidth;
		const darkMask = document.querySelector('.darkMask');
		const mainRight = document.querySelector('.main-right');
		const mainLeft = document.querySelector('.main-left');

		if (!darkMask || !mainRight || !mainLeft)
			return;

		let open = mainLeft.style.width === '';
		if (width > 992 || (ev && ev.type === 'resize'))
			open = true;

		darkMask.style.visibility = open ? '' : 'visible';
		darkMask.style.opacity = open ? '' : 1;

		if (width <= 992)
			mainLeft.style.width = open ? '0' : '';
		else
			mainLeft.style.width = '';

		mainLeft.style.transition = 'visibility 2000ms, width 200ms';
		mainLeft.style.visibility = open ? '' : 'visible';
		mainRight.style.overflowY = open ? 'auto' : 'visible';

		const header = document.querySelector('header');
		if (header)
			header.style.boxShadow = open
				? '0 2px 4px rgb(0 0 0 / 8%)'
				: '17rem 2px 4px rgb(0 0 0 / 8%)';
	}
});
