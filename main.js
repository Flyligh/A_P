window.isMobile = !1;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	window.isMobile = !0
}

function t585_init(recId) {
	var rec = document.getElementById('rec' + recId);
	if(!rec) return;
	var accordion = rec.querySelectorAll('.t585__accordion')[0];
	var headers = rec.querySelectorAll('.t585__header');
	var isLazy = document.getElementById('allrecords').getAttribute('data-tilda-lazy');
	var accordionScroll;
	if(accordion) {
		accordionScroll = accordion.getAttribute('data-scroll-to-expanded');
		accordion = accordion.getAttribute('data-accordion')
	} else {
		accordion = 'false';
		accordionScroll = 'false'
	}
	for(var i = 0; i < headers.length; i++) {
		headers[i].addEventListener('click', function() {
			var element = this;
			var container = element.nextElementSibling;
			var triggerButton = element.querySelector('.t585__trigger-button');
			var activeHeight = 0;
			var isAccordionDown = !1;
			if(triggerButton) {
				var isExpanded = triggerButton.getAttribute('aria-expanded') === 'true';
				triggerButton.setAttribute('aria-expanded', !isExpanded);
				container.hidden = isExpanded
			}
			if(element.classList.contains('t585__opened')) {
				element.classList.remove('t585__opened');
				t585_accordionHide(container)
			} else {
				if(accordionScroll === 'true' && accordion === 'true') {
					activeHeight = t585__getOldAction(rec);
					isAccordionDown = t585__getAccordionPosition(headers, element)
				}
				if(accordion === 'true') t585_accordionAllHide(headers);
				element.classList.add('t585__opened');
				container.style.display = 'block';
				var height = container.scrollHeight;
				container.style.maxHeight = '0px';
				setTimeout(function() {
					container.style.maxHeight = height + 'px';
					if(accordionScroll === 'true') {
						t585__calcHeight(element, container, activeHeight, isAccordionDown)
					}
				}, 0)
			}
			if(window.lazy === 'y' || isLazy === 'yes') {
				t_onFuncLoad('t_lazyload_update', function() {
					t_lazyload_update()
				})
			}
		})
	}
}

function t585_accordionAllHide(headers) {
	for(var i = 0; i < headers.length; i++) {
		var elementHide = headers[i];
		elementHide.classList.remove('t585__opened');
		t585_accordionHide(elementHide.nextElementSibling)
	}
}

function t585_accordionHide(container) {
	if(!container.style.maxHeight) container.style.maxHeight = container.scrollHeight + 'px';
	setTimeout(function() {
		container.style.maxHeight = '0px'
	}, 0)
}

function t585__getOldAction(rec) {
	var activeHeader = rec.querySelector('.t585__opened');
	var activeHeight = 0;
	if(activeHeader) var activeContainer = activeHeader.nextElementSibling;
	if(activeContainer) activeHeight = activeContainer.offsetHeight;
	return activeHeight
}

function t585__getAccordionPosition(headers, element) {
	var oldIndex;
	var newIndex;
	for(var i = 0; i < headers.length; i++) {
		var header = headers[i];
		if(header.classList.contains('t585__opened')) oldIndex = i;
		if(header === element) newIndex = i
	}
	return oldIndex < newIndex ? !0 : !1
}

function t585__calcHeight(element, container, activeHeight, isAccordionDown) {
	var windowHeight = window.innerHeight;
	var windowScroll = window.scrollY;
	var containerHeight = container.scrollHeight;
	var accordionHeight = containerHeight + element.offsetHeight;
	var elementTopOffset = element.getBoundingClientRect().top + windowScroll;
	var target = isAccordionDown ? elementTopOffset - activeHeight : elementTopOffset;
	var accordionBottomLine = target + accordionHeight;
	var windowBottomLine = windowScroll + windowHeight;
	if(target < windowScroll || accordionHeight > windowHeight || accordionBottomLine > windowBottomLine) {
		t585__scroll(target)
	}
}

function t585__scroll(target) {
	var duration = 400;
	var start = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
	var change = target - start;
	var currentTime = 0;
	var increment = 16;
	document.body.setAttribute('data-scrollable', 'true');

	function t585__easeInOutCubic(currentTime) {
		if((currentTime /= duration / 2) < 1) {
			return change / 2 * currentTime * currentTime * currentTime + start
		} else {
			return change / 2 * ((currentTime -= 2) * currentTime * currentTime + 2) + start
		}
	}

	function t585__animateScroll() {
		currentTime += increment;
		window.scrollTo(0, t585__easeInOutCubic(currentTime));
		if(currentTime < duration) {
			setTimeout(t585__animateScroll, increment)
		} else {
			document.body.removeAttribute('data-scrollable')
		}
	}
	t585__animateScroll()
}

function t830_init(recid) {
	var rec = document.getElementById('rec' + recid);
	var allRec = document.getElementById('allrecords');
	if(!allRec || !rec) return;
	var panel = rec.querySelector('.t830__panel');
	var overlay = rec.querySelector('.t830m__overlay');
	var menu = rec.querySelector('.t830m');
	var submenu = rec.querySelector('.t830m__submenu');
	var burger = rec.querySelector('.t830__side .t830__burger');
	var menuItemList = rec.querySelectorAll('.t830m__list-title a');
	var submenuItemList = rec.querySelectorAll('.t830m__submenu-item a');
	t830_initMenu(rec, menu, burger, overlay);
	t830_removePadding(rec, allRec);
	t830_calcCol(rec, menu, allRec, !1);
	t_onFuncLoad('t_menu__highlightActiveLinks', function() {
		t_menu__highlightActiveLinks('.t830m__list a');
		t830_openSubmenu(rec)
	});
	t830_hoverShowMenu(rec, menu, panel, overlay, burger);
	window.addEventListener('resize', function() {
		t830_calcCol(rec, menu, allRec, !0);
		t830_removePadding(rec, allRec);
		if(menu && menu.classList.contains('t830m_close') && window.innerWidth > 1499) {
			if(overlay) overlay.classList.remove('t830m__menu_show')
		}
	});
	if(submenu && submenu.classList.contains('t830m__submenu_close')) {
		t830_toggleMenu(rec)
	}
	if(window.innerWidth > 1199) {
		t830_scrollSideMenu(rec)
	}
	var isHashNotEmpty = window.location.hash.length !== 0;
	Array.prototype.forEach.call(menuItemList, function(menuItem) {
		menuItem.addEventListener('click', function() {
			if(isHashNotEmpty) {
				Array.prototype.forEach.call(menuItemList, function(menuEl) {
					menuEl.classList.remove('t-active')
				});
				menuItem.classList.add('t-active')
			}
		})
	});
	Array.prototype.forEach.call(submenuItemList, function(submenuItem) {
		submenuItem.addEventListener('click', function() {
			if(isHashNotEmpty) {
				Array.prototype.forEach.call(submenuItemList, function(submenuEl) {
					submenuEl.classList.remove('t-active')
				});
				submenuItem.classList.add('t-active')
			}
		})
	});
	t_onFuncLoad('t_menu__findAnchorLinks', function() {
		t_menu__findAnchorLinks(recid, '.t830m__list a')
	})
}

function t830_calcCol(rec, menu, allrecords, isResized) {
	if(window.innerWidth <= 1199 || !menu || window.getComputedStyle(rec).display === 'none') return;
	var label = document.querySelector('.t-tildalabel');
	if(menu.classList.contains('t830m_open')) {
		if(allrecords) allrecords.classList.add('t830__allrecords_padd-small');
		if(label) label.classList.add('t830__t-tildalabel_padd-small')
	} else {
		if(allrecords) allrecords.classList.add('t830__allrecords_padd');
		if(label) label.classList.add('t830__t-tildalabel_padd')
	}
	if(isResized) return;
	var event = document.createEvent('Event');
	event.initEvent('allRecPaddingInit', !0, !0);
	if(allrecords) allrecords.dispatchEvent(event)
}

function t830_toggleMenu(rec) {
	var titleList = rec.querySelectorAll('.t830m__list-title_toggle');
	Array.prototype.forEach.call(titleList, function(listTitle) {
		listTitle.addEventListener('click', function() {
			var submenu = listTitle.nextElementSibling;
			var textTitle = listTitle.querySelector('.t830m__list-title-text');
			t830_slideToggle(submenu);
			if(textTitle) textTitle.classList.toggle('t830m__list-title-text_opacity');
			if(textTitle) textTitle.classList.toggle('t-menu__link-item')
		})
	})
}

function t830_openSubmenu(rec) {
	var activeLink = rec.querySelector('.t830m__submenu-item a.t-active');
	var submenu = activeLink ? activeLink.closest('.t830m__submenu') : null;
	if(submenu) submenu.style.display = 'block'
}

function t830_hoverShowMenu(rec, menu, panel, overlay, burger) {
	if(window.innerWidth <= 1199 || !panel || !panel.classList.contains('t830__panel_hover')) return;
	panel.addEventListener('mouseenter', function() {
		if(menu) menu.classList.add('t830m__menu_show');
		if(burger) burger.classList.add('t830__burger_open');
		if(overlay) overlay.classList.add('t830m__overlay_hover')
	});
	if(menu) {
		menu.addEventListener('mouseleave', function() {
			menu.classList.remove('t830m__menu_show');
			if(burger) burger.classList.remove('t830__burger_open')
		})
	}
	if(overlay) {
		overlay.addEventListener('mouseenter', function() {
			overlay.classList.remove('t830m__overlay_hover');
			if(burger) burger.classList.remove('t830__burger_open');
			if(menu) menu.classList.remove('t830m__menu_show')
		})
	}
	var menuLinks = menu.querySelectorAll('a');
	Array.prototype.forEach.call(menuLinks, function(link) {
		link.addEventListener('click', function() {
			menu.classList.remove('t830m__menu_show');
			if(burger) burger.classList.remove('t830__burger_open')
		})
	});
	if(burger) {
		burger.addEventListener('click', function() {
			if(burger.classList.contains('t830__burger_open')) {
				t830_closeMenu(rec, menu, overlay);
				burger.classList.remove('t830__burger_open')
			} else {
				burger.classList.add('t830__burger_open');
				if(menu) menu.classList.add('t830m__menu_show');
				if(overlay) overlay.classList.add('t830m__overlay_hover')
			}
		})
	}
}

function t830_showMenu(rec, menu, burger, overlay) {
	var panel = rec.querySelector('.t830__panel');
	if(typeof t_triggerEvent === 'function') t_triggerEvent(document.body, 'popupShowed');
	document.body.classList.add('t830__body_menushowed');
	if(overlay) overlay.classList.add('t830m__menu_show');
	if(menu) menu.classList.add('t830m__menu_show');
	var closedMenuEls = rec.querySelectorAll('.t830m__overlay, .t830m__close, a[href*="#"]');
	closedMenuEls = Array.prototype.filter.call(closedMenuEls, function(el) {
		return !(el.classList.contains('tooltipstered') || el.classList.contains('t794__tm-link') || el.classList.contains('t978__tm-link') || el.classList.contains('t966__tm-link'))
	});
	closedMenuEls.forEach(function(el) {
		el.addEventListener('click', function() {
			t830_closeMenu(rec, menu, overlay);
			if(burger) burger.classList.remove('t830__burger_open')
		})
	});
	if(panel) panel.classList.add('t830__panel_close');
	var popupBg = document.querySelector('.t-site-search-popup__background');
	document.addEventListener('keydown', function(e) {
		if(e.keyCode !== 27 || popupBg) return;
		if(typeof t_triggerEvent === 'function') t_triggerEvent(document.body, 'popupHidden');
		document.body.classList.remove('t830__body_menushowed');
		if(menu) menu.classList.remove('t830m__menu_show');
		if(burger) burger.classList.remove('t830__burger_open');
		if(overlay) overlay.classList.remove('t830m__menu_show')
	})
}

function t830_closeMenu(rec, menu, overlay) {
	var panel = rec.querySelector('.t830__panel');
	if(menu && menu.classList.contains('t830m_open') && window.innerWidth < 1500) {
		if(panel) panel.classList.remove('t830__panel_close')
	}
	if(typeof t_triggerEvent === 'function') t_triggerEvent(document.body, 'popupHidden');
	document.body.classList.remove('t830__body_menushowed');
	if(menu) menu.classList.remove('t830m__menu_show');
	if(overlay) overlay.classList.remove('t830m__menu_show')
}

function t830_initMenu(rec, menu, burger, overlay) {
	if(!rec) return;
	var panel = rec.querySelector('.t830__panel');
	var menuContent = rec.querySelector('.t830__menu__content');
	if(typeof jQuery !== 'undefined') {
		$('.t830').bind('clickedAnchorInTooltipMenu', function() {
			t830_closeMenu(rec, menu, overlay)
		})
	} else {
		var menuBlock = document.querySelector('.t830');
		if(menuBlock) {
			menuBlock.addEventListener('clickedAnchorInTooltipMenu', function() {
				t830_closeMenu(rec, menu, overlay)
			})
		}
	}
	if(!panel || !menuContent || !menu) return;
	if(panel.classList.contains('t830__panel_click') || (panel.classList.contains('t830__panel_hover') && window.innerWidth <= 1199)) {
		menuContent.addEventListener('click', function(e) {
			if(menu.classList.contains('t830m__menu_show')) {
				if(burger) burger.classList.remove('t830__burger_open');
				t830_closeMenu(rec, menu, overlay)
			} else {
				if(burger) burger.classList.add('t830__burger_open');
				t830_showMenu(rec, menu, burger, overlay)
			}
		})
	}
}

function t830_scrollSideMenu(rec) {
	var container = rec ? rec.querySelector('.t830m__container') : null;
	if(!container) return;
	var events = ['scroll', 'wheel', 'DOMMouseScroll', 'mousewheel'];
	events.forEach(function(event) {
		container.addEventListener(event, function(e) {
			var searchResult = rec.querySelector('.t-site-search-dm');
			if(!searchResult) {
				t830_stopScroll(container, e)
			}
		})
	})
}

function t830_stopScroll(container, eventScroll) {
	var scrollTop = container.scrollTop;
	var scrollHeight = container.scrollHeight;
	var height = container.offsetHeight;
	var delta = eventScroll.type === 'DOMMouseScroll' ? eventScroll.detail * -40 : eventScroll.wheelDelta;
	var up = delta > 0;
	var prevent = function() {
		eventScroll.stopPropagation();
		eventScroll.preventDefault();
		eventScroll.returnValue = !1;
		return !1
	};
	if(!up && -delta > scrollHeight - height - scrollTop) {
		container.scrollTo(0, scrollHeight);
		return prevent()
	} else if(up && delta > scrollTop) {
		container.scrollTo(0, 0);
		return prevent()
	}
}

function t830_removePadding(rec, allrecords) {
	if(!allrecords || !rec || window.getComputedStyle(rec).display !== 'none') return;
	allrecords.style.paddingLeft = '0';
	var label = document.querySelector('.t-tildalabel');
	if(label) label.style.paddingLeft = '0'
}

function t830_slideToggle(target) {
	if(!target) return;
	if(target.getAttribute('data-slide') === 'y') return;
	if(window.getComputedStyle(target).display === 'none') {
		return t830_slideDown(target)
	} else {
		return t830_slideUp(target)
	}
}

function t830_slideUp(target) {
	if(!target) return;
	var step = target.offsetHeight / 30;
	var difference = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.setAttribute('data-slide', 'y');
	var timerID = setInterval(function() {
		difference -= step;
		target.style.height = difference + 'px';
		if(difference <= 0) {
			target.style.height = '';
			target.style.overflow = '';
			target.style.display = 'none';
			target.removeAttribute('data-slide');
			clearInterval(timerID)
		}
	}, 10)
}

function t830_slideDown(target) {
	if(!target) return;
	target.style.display = '';
	var currentDisplayValue = window.getComputedStyle(target).display;
	target.style.display = currentDisplayValue === 'none' ? 'block' : currentDisplayValue;
	var targetHeight = target.offsetHeight;
	target.style.height = '0';
	target.style.overflow = 'hidden';
	target.setAttribute('data-slide', 'y');
	var step = targetHeight / 30;
	var difference = 0;
	var timerID = setInterval(function() {
		target.style.height = difference + 'px';
		difference += step;
		if(difference >= targetHeight) {
			target.style.height = '';
			target.style.overflow = '';
			target.removeAttribute('data-slide');
			clearInterval(timerID)
		}
	}, 10)
}

function t450_showMenu(recid) {
	var rec = document.getElementById('rec' + recid);
	if(!rec) return;
	var menu = rec.querySelector('.t450');
	var overlay = rec.querySelector('.t450__overlay');
	var menuElements = rec.querySelectorAll('.t450__overlay, .t450__close, a[href*="#"]');
	if(typeof t_triggerEvent === 'function') t_triggerEvent(document.body, 'popupShowed');
	document.body.classList.add('t450__body_menushowed');
	if(menu) menu.classList.add('t450__menu_show');
	if(overlay) overlay.classList.add('t450__menu_show');
	if(menu) {
		menu.addEventListener('clickedAnchorInTooltipMenu', function() {
			t450_closeMenu(menu, overlay)
		})
	}
	Array.prototype.forEach.call(menuElements, function(element) {
		element.addEventListener('click', function() {
			if(element.closest('.tooltipstered, .t-menusub__target-link, .t794__tm-link, .t966__tm-link, .t978__tm-link')) return;
			if(element.href && (element.href.substring(0, 7) === '#price:' || element.href.substring(0, 9) === '#submenu:')) return;
			t450_closeMenu(menu, overlay)
		})
	});
	document.addEventListener('keydown', function(e) {
		if(e.keyCode === 27) {
			document.body.classList.remove('t390__body_popupshowed');
			var popups = document.querySelectorAll('.t390');
			Array.prototype.forEach.call(popups, function(popup) {
				popup.classList.remove('t390__popup_show')
			})
		}
	});
	rec.addEventListener('click', function(e) {
		if(e.target.closest('.t966__tm-link, .t978__tm-link')) {
			t450_checkSize(recid);
			if(e.target.closest('.t978__tm-link')) {
				setTimeout(function() {
					var hookLink = e.target.closest('.t978__tm-link');
					var menuBlock = hookLink.nextElementSibling;
					var submenuLinks = menuBlock ? menuBlock.querySelectorAll('.t978__menu-link') : [];
					Array.prototype.forEach.call(submenuLinks, function(link) {
						link.addEventListener('click', function() {
							t450_checkSize(recid)
						})
					})
				}, 300)
			}
		}
	});
	menu.addEventListener('menuOverflow', function() {
		t450_checkSize(recid)
	});
	t450_highlight(recid)
}

function t450_closeMenu(menu, overlay) {
	if(typeof t_triggerEvent === 'function') t_triggerEvent(document.body, 'popupHidden');
	document.body.classList.remove('t450__body_menushowed');
	if(menu) menu.classList.remove('t450__menu_show');
	if(overlay) overlay.classList.remove('t450__menu_show')
}

function t450_checkSize(recid) {
	var rec = document.getElementById('rec' + recid);
	var menu = rec ? rec.querySelector('.t450') : null;
	if(!menu) return;
	var container = menu.querySelector('.t450__container');
	var topContainer = menu.querySelector('.t450__top');
	var rightContainer = menu.querySelector('.t450__rightside');
	setTimeout(function() {
		var topContainerHeight = topContainer ? topContainer.offsetHeight : 0;
		var rightContainerHeight = rightContainer ? rightContainer.offsetHeight : 0;
		var containerPaddingTop = container ? window.getComputedStyle(container).paddingTop : '0';
		var containerPaddingBottom = container ? window.getComputedStyle(container).paddingBottom : '0';
		containerPaddingTop = parseInt(containerPaddingTop, 10);
		containerPaddingBottom = parseInt(containerPaddingBottom, 10);
		if(topContainerHeight + rightContainerHeight + containerPaddingTop + containerPaddingBottom > document.documentElement.clientHeight) {
			menu.classList.add('t450__overflowed')
		} else {
			menu.classList.remove('t450__overflowed')
		}
	})
}

function t450_appearMenu(recid) {
	var rec = document.getElementById('rec' + recid);
	var burger = rec ? rec.querySelector('.t450__menu__content') : null;
	if(!burger) return;
	var burgerAppearOffset = burger ? burger.getAttribute('data-appearoffset') : '';
	var burgerHideOffset = burger ? burger.getAttribute('data-hideoffset') : '';
	if(burgerAppearOffset) {
		burgerAppearOffset = t450_appearMenuParseNumber(burgerAppearOffset);
		if(window.pageYOffset >= burgerAppearOffset) {
			if(burger.classList.contains('t450__beforeready')) {
				burger.classList.remove('t450__beforeready')
			}
		} else {
			burger.classList.add('t450__beforeready')
		}
	}
	if(burgerHideOffset) {
		burgerHideOffset = t450_appearMenuParseNumber(burgerHideOffset);
		var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
		if(window.pageYOffset + window.innerHeight >= scrollHeight - burgerHideOffset) {
			if(!burger.classList.contains('t450__beforeready')) {
				burger.classList.add('t450__beforeready')
			}
		} else if(burgerAppearOffset) {
			if(window.pageYOffset >= burgerAppearOffset) {
				burger.classList.remove('t450__beforeready')
			}
		} else {
			burger.classList.remove('t450__beforeready')
		}
	}
}

function t450_appearMenuParseNumber(string) {
	if(string.indexOf('vh') > -1) {
		string = Math.floor((window.innerHeight * (parseInt(string) / 100)))
	}
	return parseInt(string, 10)
}

function t450_initMenu(recid) {
	var rec = document.getElementById('rec' + recid);
	var menu = rec ? rec.querySelector('.t450') : null;
	var overlay = rec ? rec.querySelector('.t450__overlay') : null;
	var burger = rec ? rec.querySelector('.t450__burger_container') : null;
	var menuLinks = rec ? rec.querySelectorAll('.t-menu__link-item.t450__link-item_submenu') : [];
	var hook = menu ? menu.getAttribute('data-tooltip-hook') : '';
	if(hook) {
		document.addEventListener('click', function(e) {
			if(e.target.closest('a[href="' + hook + '"]')) {
				e.preventDefault();
				t450_closeMenu(menu, overlay);
				t450_showMenu(recid);
				t450_checkSize(recid)
			}
		})
	}
	if(burger) {
		burger.addEventListener('click', function() {
			t450_closeMenu(menu, overlay);
			t450_showMenu(recid);
			t450_checkSize(recid)
		})
	}
	window.addEventListener('resize', function() {
		t450_checkSize(recid)
	});
	if(!window.isMobile) return;
	Array.prototype.forEach.call(menuLinks, function(link) {
		link.addEventListener('click', function() {
			t450_checkSize(recid)
		})
	})
}

function t450_highlight(recid) {
	var url = window.location.href;
	var pathname = window.location.pathname;
	var hash = window.location.hash;
	if(url.substr(url.length - 1) === '/') {
		url = url.slice(0, -1)
	}
	if(pathname.substr(pathname.length - 1) === '/') {
		pathname = pathname.slice(0, -1)
	}
	if(pathname.charAt(0) === '/') {
		pathname = pathname.slice(1)
	}
	if(pathname === '') {
		pathname = '/'
	}
	var shouldBeActiveElements = document.querySelectorAll('.t450__menu a[href=\'' + url + '\'], ' + '.t450__menu a[href=\'' + url + '/\'], ' + '.t450__menu a[href=\'' + pathname + '\'], ' + '.t450__menu a[href=\'/' + pathname + '\'], ' + '.t450__menu a[href=\'' + pathname + '/\'], ' + '.t450__menu a[href=\'/' + pathname + '/\']' + (hash ? ', .t450__menu a[href=\'' + hash + '\']' : ''));
	var rec = document.getElementById('rec' + recid);
	var menuLinks = rec ? rec.querySelectorAll('.t450__menu a') : [];
	Array.prototype.forEach.call(menuLinks, function(link) {
		if(link.getAttribute('data-highlighted-by-user') !== 'y') link.classList.remove('t-active')
	});
	Array.prototype.forEach.call(shouldBeActiveElements, function(link) {
		link.classList.add('t-active')
	})
}