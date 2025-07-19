/*
 * Infinite_Horizontal_Article_Browser (ihab) v0.9
 * 
 * written by Paul Fernihough 2012
 * http://spoddycoder.com
 * 
 * requires: 
 * 		jQuery
 * 		jquery.debouncedresize.js
 */

function Horizontal_Article_Browser(sectionId) {
	var article, tot_width, _i, _len, _ref,
	_this = this;
	this.sectionId = sectionId;
	this.section = jQuery('#' + this.sectionId);
	this.articles = this.section.find('>article');
	this.locked = false;
	this.scroll_articles;
	this.scroll_distance;
	this.hab_container;
	this.hab_inner;
	this.mask_left;
	this.button_left;
	this.mask_right;
	this.button_right;
	this.browser_width;
	this.container_width;
	this.mask_width;
	this.resizeTimer;
	
	this.article_width = jQuery(this.articles[0]).outerWidth(true);
	tot_width = 0;
	_ref = this.articles;
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		article = _ref[_i];
		jQuery(article).css('float', 'left');
		tot_width += jQuery(article).outerWidth(true);
	}
	this.articles.wrapAll('<div id="' + sectionId + '-hab-inner" />');
	this.hab_inner = jQuery('#' + sectionId + '-hab-inner');
	this.hab_inner.css('position', 'relative');
	this.hab_inner.width(tot_width);
	this.hab_inner.wrapAll('<div id="' + sectionId + '-hab-container" class="hab-container" />');
	this.hab_container = jQuery('#' + sectionId + '-hab-container');
	this.hab_container.css('position', 'relative');
	this.hab_container.css('overflow', 'hidden');
	this.hab_container.append('<div id="' + sectionId + '-hab-mask-left" class="hab-mask"></div>');
	this.mask_left = jQuery('#' + sectionId + '-hab-mask-left');
	this.mask_left.click(function() {
		return _this.slideLeft();
	});
	this.hab_container.append('<div id="' + sectionId + '-hab-mask-right" class="hab-mask"></div>');
	this.mask_right = jQuery('#' + sectionId + '-hab-mask-right');
	this.mask_right.click(function() {
		return _this.slideRight();
	});
	this.hab_container.append('<div id="' + sectionId + '-hab-button-left" class="hab-button hab-button-left"></div>');
	this.button_left = jQuery('#' + sectionId + '-hab-button-left');
	this.button_left.html('&laquo;');
	this.button_left.click(function() {
		return _this.slideLeft();
	});
	this.hab_container.append('<div id="' + sectionId + '-hab-button-right" class="hab-button hab-button-right"></div>');
	this.button_right = jQuery('#' + sectionId + '-hab-button-right');
	this.button_right.html('&raquo;');
	this.button_right.click(function() {
		return _this.slideRight();
	});
	this.hab_container.append('<div style="clear:both"></div>');
	jQuery(window).on("debouncedresize", function( event ) {
		return _this.resize();
	});
	this.section.css('visibility', 'visible');	// set ihab container (section) to visible: false initially in the stylesheet
	this.resize();
}

Horizontal_Article_Browser.prototype.slideLeft = function() {
	var i, tmp, _ref,
	_this = this;
	if (!this.locked) {
		this.locked = true;
		for (i = 1, _ref = this.scroll_articles; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
			tmp = this.hab_inner.find('>article:last').remove();
			this.hab_inner.prepend(tmp);
		}
		this.hab_inner.css('left', '-=' + this.scroll_distance);
		return this.hab_inner.animate({
			left: '+=' + this.scroll_distance
		}, 1000, '', function() {
			return _this.locked = false;
		});
	}
};

Horizontal_Article_Browser.prototype.slideRight = function() {
	var i, tmp, _ref,
	_this = this;
	if (!this.locked) {
		this.locked = true;
		for (i = 1, _ref = this.scroll_articles; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
			tmp = this.hab_inner.find('>article:first').remove();
			this.hab_inner.append(tmp);
		}
		this.hab_inner.css('left', '+=' + this.scroll_distance);
		return this.hab_inner.animate({
			left: '-=' + this.scroll_distance
		}, 1000, '', function() {
			return _this.locked = false;
		});
	}
};

Horizontal_Article_Browser.prototype.resize = function() {
	var articles_on_left, i, num_repeats, tmp, total_articles_needed;
	this.browser_width = jQuery(window).width();
	this.container_width = jQuery(this.section).width();
	this.mask_width = (this.browser_width - this.container_width) * 0.5;
	if (this.mask_width < 0) this.mask_width = 0;
	this.hab_container.css('left', -this.mask_width);
	if (this.browser_width >= this.container_width) {
		this.hab_container.width(this.browser_width);
	} else {
		this.hab_container.width(this.container_width);
	}
	this.mask_left.css('min-height', this.hab_container.outerHeight());
	this.mask_left.css('min-width', this.mask_width);
	this.mask_left.css('position', 'absolute');
	this.mask_left.css('left', 0);
	this.mask_left.css('top', 0);
	this.mask_right.css('min-height', this.hab_container.outerHeight());
	this.mask_right.css('min-width', this.mask_width);
	this.mask_right.css('position', 'absolute');
	this.mask_right.css('left', this.mask_width + this.container_width);
	this.mask_right.css('top', 0);
	this.button_left.css('position', 'absolute');
	this.button_right.css('position', 'absolute');
	if (this.browser_width <= (this.container_width + this.button_left.outerWidth(true + this.button_right.outerWidth(true)))) {
		this.button_left.css('left', this.mask_width);
		this.button_right.css('left', this.mask_width + this.container_width - this.button_right.outerWidth(true));
	} else {
		this.button_left.css('left', this.mask_width - this.button_left.outerWidth(true));
		this.button_right.css('left', this.mask_width + this.container_width);
	}
	this.scroll_articles = Math.floor(this.container_width / this.article_width);
	this.scroll_distance = this.scroll_articles * this.article_width;
	total_articles_needed = Math.ceil(this.browser_width / this.article_width) + ((Math.ceil(this.scroll_distance / this.article_width)) * 2);
	if (total_articles_needed <= this.articles.length) {
		this.hab_inner.empty();
		jQuery(this.articles).clone().appendTo(this.hab_inner);
		this.hab_inner.width(this.articles.length * this.article_width);
	} else {
		num_repeats = Math.ceil(total_articles_needed / this.articles.length);
		this.hab_inner.empty();
		for (i = 1; 1 <= num_repeats ? i <= num_repeats : i >= num_repeats; 1 <= num_repeats ? i++ : i--) {
			jQuery(this.articles).clone().appendTo(this.hab_inner);
		}
		this.hab_inner.width(num_repeats * this.articles.length * this.article_width);
	}
	articles_on_left = (Math.ceil(this.mask_width / this.article_width)) + (Math.ceil(this.scroll_distance / this.article_width));
	for (i = 1; 1 <= articles_on_left ? i <= articles_on_left : i >= articles_on_left; 1 <= articles_on_left ? i++ : i--) {
		tmp = this.hab_inner.find('>article:last').remove();
		this.hab_inner.prepend(tmp);
	}
	return this.hab_inner.css('left', this.mask_width - (this.article_width * articles_on_left));
};