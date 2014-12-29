"use strict";
$(function() {
  return window.after = function(ms, callback) {
    return setTimeout(callback, ms);
  };
});

$(function() {
  var parse, rewriteSelector;
  rewriteSelector = function(context, name, pos) {
    var original;
    original = context[name];
    if (!original) {
      return;
    }
    context[name] = function() {
      arguments[pos] = arguments[pos].replace(/@@([\w\u00c0-\uFFFF\-]+)/g, '[data-block~="$1"]');
      arguments[pos] = arguments[pos].replace(/@([\w\u00c0-\uFFFF\-]+)/g, '[data-role~="$1"]');
      return original.apply(context, arguments);
    };
    return $.extend(context[name], original);
  };
  rewriteSelector($, 'find', 0);
  rewriteSelector($, 'multiFilter', 0);
  rewriteSelector($.find, 'matchesSelector', 1);
  rewriteSelector($.find, 'matches', 0);
  parse = function(roleString, without) {
    var i, result, role, roles;
    role = void 0;
    result = [];
    roles = $.trim(roleString).split(/\s+/);
    i = 0;
    while (i < roles.length) {
      role = roles[i];
      if (!~$.inArray(role, result) && (!without || !~$.inArray(role, without))) {
        result.push(role);
      }
      i++;
    }
    return result;
  };
  return $.extend($.fn, {
    roles: function() {
      return parse(this.attr('data-role'));
    },
    hasRole: function(roleName) {
      var i, roles;
      roles = parse(roleName);
      i = 0;
      while (i < roles.length) {
        if (!this.is('@' + roles[i])) {
          return false;
        }
        i++;
      }
      return true;
    },
    addRole: function(roleName) {
      if (this.hasRole(roleName)) {
        return this;
      }
      return this.each(function(_, element) {
        var $el, roles;
        $el = $(element);
        roles = parse($el.attr('data-role') + ' ' + roleName).join(' ');
        $el.attr('data-role', roles);
      });
    },
    removeRole: function(roleName) {
      if (!this.hasRole(roleName)) {
        return this;
      }
      return this.each(function(_, element) {
        var $el, roles;
        $el = $(element);
        roles = parse($el.attr('data-role'), parse(roleName)).join(' ');
        $el.attr('data-role', roles);
      });
    },
    toggleRole: function(roleName) {
      var callFunction, i, roles;
      roles = parse(roleName);
      i = 0;
      while (i < roles.length) {
        callFunction = (this.hasRole(roles[i]) ? 'removeRole' : 'addRole');
        this[callFunction].call(this, roles[i]);
        i++;
      }
      return this;
    }
  });
});

$(function() {
  var $columns;
  $columns = $('@column');
  $(window).on('resize', function() {
    var height, heights;
    $columns.css('height', 'auto');
    heights = [];
    $columns.each((function(_this) {
      return function(i, item) {
        return heights.push($(item).outerHeight());
      };
    })(this));
    height = Math.max.apply(Math, heights);
    return $columns.css('height', height);
  });
  return after(500, (function(_this) {
    return function() {
      return $(window).trigger('resize');
    };
  })(this));
});

$(function() {
  var $body, $closeModalLinks, $hideBlockLinks, $photos, $showBlockLinks, $showLightboxLinks, $switchBlockLinks, $toggleBlockLinks, $zoomModalLinks, bodyLock, bodyUnlock, getBlock, getLink, hideBlock, setArrows, setPhoto, showBlock, toggleBlock;
  $body = $('body');
  $showBlockLinks = $('@showBlock');
  $hideBlockLinks = $('@hideBlock');
  $switchBlockLinks = $('@switchBlock');
  $toggleBlockLinks = $('@toggleBlock');
  $showLightboxLinks = $('@lightbox');
  $photos = $('@photos').find('@lightbox').find('img');
  getLink = function(role) {
    return $('[data-target="' + role + '"]');
  };
  getBlock = function(role) {
    return $('@' + role);
  };
  toggleBlock = function(role) {
    getLink(role).toggleClass('is-active');
    return getBlock(role).toggleClass('is-visible');
  };
  bodyLock = function(role) {
    if (getBlock(role).hasRole('modal')) {
      return $body.addClass('is-locked');
    }
  };
  bodyUnlock = function(role) {
    if (getBlock(role).hasRole('modal')) {
      return $body.removeClass('is-locked');
    }
  };
  hideBlock = function(role) {
    getLink(role).removeClass('is-active');
    getBlock(role).removeClass('is-visible');
    bodyUnlock(role);
    return $body.off('keyup.hideBlock');
  };
  showBlock = function(role) {
    getLink(role).addClass('is-active');
    getBlock(role).addClass('is-visible');
    bodyLock(role);
    return $body.on('keyup.hideBlock', function(e) {
      if (e.keyCode === 27) {
        return hideBlock(role);
      }
    });
  };
  $showBlockLinks.on('click', function() {
    var role;
    role = $(this).attr('data-target');
    return showBlock(role);
  });
  $hideBlockLinks.on('click', function() {
    var role;
    role = $(this).attr('data-target');
    return hideBlock(role);
  });
  $toggleBlockLinks.on('click', function() {
    var role;
    role = $(this).attr('data-target');
    return toggleBlock(role);
  });
  $switchBlockLinks.on('click', function() {
    var targetRole, targetsRole;
    targetRole = $(this).attr('data-target');
    targetsRole = $(this).attr('data-targets');
    $('@' + targetsRole).removeClass('is-visible').filter('@' + targetRole).addClass('is-visible');
    return $('[data-targets="' + targetsRole + '"]').removeClass('is-active').filter($(this)).addClass('is-active');
  });
  $closeModalLinks = $('@modal-close');
  $zoomModalLinks = $('@modal-zoom');
  $closeModalLinks.on('click', function() {
    var $modal, role;
    $modal = $(this).closest('@modal');
    $modal.removeClass('is-visible');
    role = $modal.roles()[1];
    $('[data-target="' + role + '"]').removeClass('is-active');
    return bodyUnlock(role);
  });
  $zoomModalLinks.on('click', function() {
    var $modal;
    $modal = $(this).closest('@modal');
    return $modal.toggleClass('is-zoomed');
  });
  setPhoto = function($original) {
    var $img, $modal, $modalPicPlace, $modalTitlePlace;
    $modal = $('@modal@photos');
    $modalPicPlace = $modal.find('@modal-pic');
    $modalTitlePlace = $modal.find('@modal-title');
    $modalTitlePlace.html('');
    $img = $original.clone().addRole('modal-zoom');
    $modalPicPlace.html($img);
    $modalTitlePlace.html($img.attr('title'));
    return setArrows($photos, $original);
  };
  setArrows = function($photos, $original) {
    var $arrows, $next, $prev, i;
    $arrows = $('@modal@photos').find('@modal-arrows');
    $prev = $('@modal@photos').find('@modal-prev');
    $next = $('@modal@photos').find('@modal-next');
    i = $photos.index($original);
    if ($photos.length > 1) {
      if (i > 0) {
        $prev.addClass('is-visible');
      } else {
        $prev.removeClass('is-visible');
      }
      if (i + 1 === $photos.length) {
        $next.removeClass('is-visible');
      } else {
        $next.addClass('is-visible');
      }
    } else {
      $arrows.removeClass('is-visible');
    }
    $next.on('click', function() {
      return setPhoto($photos.eq(i + 1));
    });
    return $prev.on('click', function() {
      return setPhoto($photos.eq(i - 1));
    });
  };
  return $showLightboxLinks.on('click', function() {
    var $original, role;
    role = 'photos';
    $original = $(this).find('img');
    setPhoto($original);
    showBlock(role);
    return false;
  });
});

$(function() {
  var swiperSoon;
  swiperSoon = $('@swiper@soon').swiper({
    mode: 'horizontal',
    loop: false,
    slidesPerView: 3,
    calculateHeight: true,
    visibilityFullFit: false,
    createPagination: false,
    roundLengths: true
  });
  $('@soonPrev').on('click', function() {
    return swiperSoon.swipePrev();
  });
  return $('@soonNext').on('click', function() {
    return swiperSoon.swipeNext();
  });
});

$(function() {
  var swiperPhotos;
  return swiperPhotos = $('@swiper@photos').swiper({
    mode: 'horizontal',
    loop: false,
    slidesPerView: 3,
    slidesPerGroup: 3,
    slidesPerViewFit: true,
    calculateHeight: true,
    visibilityFullFit: false,
    roundLengths: true,
    createPagination: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationAsRange: true
  });
});

$(function() {
  var swiperPhotos;
  return swiperPhotos = $('@swiper@archive').swiper({
    mode: 'vertival',
    loop: false,
    slidesPerView: 'auto',
    calculateHeight: false,
    cssWidthAndHeight: true,
    width: '100%',
    slidesPerViewFit: false,
    visibilityFullFit: true,
    freeMode: true,
    scrollContainer: true
  });
});

$(function() {
  var $column, $constrain;
  $column = $('@columnFixed');
  $constrain = $('.constrain').first();
  return $(window).on('resize', function() {
    return $column.css('right', $constrain.offset().left);
  });
});

$(function() {
  return $('@fotorama').fotorama({
    arrows: false,
    nav: 'thumbs',
    thumbWidth: 120,
    thumbHeight: 90,
    thumbmargin: 10,
    thumbborderwidth: 1,
    width: '100%',
    fit: 'cober'
  });
});

$(function() {
  return $('@gallery').isotope({
    itemSelector: '.gallery-item',
    masonry: {
      columnWidth: 280,
      gutter: 10
    }
  });
});
