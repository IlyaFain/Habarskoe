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
  var $body, $closeModalLinks, $hideBlockLinks, $showBlockLinks, $switchBlockLinks, $toggleBlockLinks, $zoomModalLinks, bodyLock, bodyUnlock, getBlock, getLink, hideBlock, showBlock, toggleBlock;
  $body = $('body');
  $showBlockLinks = $('@showBlock');
  $hideBlockLinks = $('@hideBlock');
  $switchBlockLinks = $('@switchBlock');
  $toggleBlockLinks = $('@toggleBlock');
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
    bodyUnock(role);
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
  return $zoomModalLinks.on('click', function() {
    var $modal;
    $modal = $(this).closest('@modal');
    return $modal.toggleClass('is-zoomed');
  });
});

$(function() {
  var swiperPhotos, swiperSoon;
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
  $('@soonNext').on('click', function() {
    return swiperSoon.swipeNext();
  });
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
