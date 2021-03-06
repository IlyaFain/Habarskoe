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
  var $columns, likeFooterHeight;
  $columns = $('@column');
  likeFooterHeight = function(cb) {
    var height;
    height = $('.footer').outerHeight();
    $('@likeFooterHeight').innerHeight(height);
    if (swiperPhotos) {
      swiperPhotos.resizeFix();
    }
    if (swiperSoon) {
      swiperSoon.resizeFix();
    }
    return cb();
  };
  $(window).on('resize', function() {
    return likeFooterHeight(function() {
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
  });
  return $(window).on('load', function() {
    return $(window).trigger('resize');
  });
});

$(function() {
  var $body, $closeModalLinks, $hideBlockLinks, $photos, $showBlockLinks, $showLightboxLinks, $switchBlockLinks, $toggleBlockLinks, $zoomModalLinks, bodyLock, bodyUnlock, getBlock, getLink, setArrows, setPhoto, toggleBlock;
  $body = $('body');
  $showBlockLinks = '@showBlock';
  $hideBlockLinks = '@hideBlock';
  $switchBlockLinks = '@switchBlock';
  $toggleBlockLinks = '@toggleBlock';
  $showLightboxLinks = '@lightbox';
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
  window.hideBlock = function(role) {
    getLink(role).removeClass('is-active');
    getBlock(role).removeClass('is-visible');
    bodyUnlock(role);
    return $body.off('keyup.hideBlock');
  };
  window.showBlock = function(role) {
    getLink(role).addClass('is-active');
    getBlock(role).addClass('is-visible');
    bodyLock(role);
    return $body.on('keyup.hideBlock', function(e) {
      if (e.keyCode === 27) {
        return hideBlock(role);
      }
    });
  };
  $body.on('click', $showBlockLinks, function() {
    var role;
    role = $(this).attr('data-target');
    showBlock(role);
    return $(window).trigger('resize');
  });
  $body.on('click', $hideBlockLinks, function() {
    var role;
    role = $(this).attr('data-target');
    hideBlock(role);
    return $(window).trigger('resize');
  });
  $body.on('click', $toggleBlockLinks, function() {
    var role;
    role = $(this).attr('data-target');
    toggleBlock(role);
    return $(window).trigger('resize');
  });
  $body.on('click', $switchBlockLinks, function() {
    var targetRole, targetsRole;
    targetRole = $(this).attr('data-target');
    targetsRole = $(this).attr('data-targets');
    $('@' + targetsRole).removeClass('is-visible').filter('@' + targetRole).addClass('is-visible');
    return $('[data-targets="' + targetsRole + '"]').removeClass('is-active').filter($(this)).addClass('is-active');
  });
  $closeModalLinks = '@modal-close';
  $zoomModalLinks = '@modal-zoom';
  $body.on('click', $closeModalLinks, function() {
    var $modal, role;
    $modal = $(this).closest('@modal');
    $modal.removeClass('is-visible');
    role = $modal.roles()[1];
    $('[data-target="' + role + '"]').removeClass('is-active');
    return bodyUnlock(role);
  });
  $body.on('click', $zoomModalLinks, function() {
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
  return $body.on('click', $showLightboxLinks, function() {
    var $original, role;
    role = 'photos';
    $original = $(this).find('img');
    setPhoto($original);
    showBlock(role);
    return false;
  });
});

$(function() {
  window.swiperSoon = $('@swiper@soon').swiper({
    direction: 'horizontal',
    loop: false,
    slidesPerView: 3,
    calculateHeight: true,
    visibilityFullFit: false,
    createPagination: false,
    roundLengths: true,
    autoResize: true,
    resizeReInit: true
  });
  $('@soonPrev').on('click', function() {
    return swiperSoon.swipePrev();
  });
  return $('@soonNext').on('click', function() {
    return swiperSoon.swipeNext();
  });
});

$(function() {
  return window.swiperPhotos = $('@swiper@photos').swiper({
    direction: 'horizontal',
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
    paginationAsRange: true,
    autoResize: true,
    resizeReInit: true
  });
});

$(function() {
  var swiperPhotos;
  return swiperPhotos = $('@swiper@archive').swiper({
    direction: 'vertical',
    speed: 300,
    loop: false,
    slidesPerView: 'auto',
    calculateHeight: false,
    cssWidthAndHeight: true,
    width: '100%',
    slidesPerViewFit: false,
    visibilityFullFit: true,
    freeMode: true,
    mousewheelControl: true,
    scrollContainer: true,
    scrollbar: '.swiper-scrollbar',
    onInit: function() {
      var $swiperContainer, swiperContainer, wheelDistance;
      $swiperContainer = $('@swiper@archive');
      swiperContainer = $swiperContainer[0];
      $swiperContainer.on('mousewheel', function() {
        return console.log('1333');
      });
      wheelDistance = function(e) {
        var d, w;
        e = e || event;
        w = e.wheelDelta;
        d = e.detail;
        console.log('123');
        if (w) {
          return w / 120;
        } else if (d) {
          return -d / 3;
        } else {
          return 0;
        }
      };
      return swiperContainer.addEventListener('WheelEvent', wheelDistance, false);
    }
  });
});

$(function() {
  var $column, $constrain;
  $column = $('@columnFixed');
  $constrain = $('.constrain').first();
  $(window).on('resize', function() {
    return $column.css('right', $constrain.offset().left);
  });
  if ($column[0]) {
    $(window).resize();
    return $column.addClass('is-visible');
  }
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
  var $gallery, $images, l;
  $gallery = $images = $('@gallery img');
  l = $images.length - 1;
  return $images.waitForImages({
    waitForAll: true,
    each: function(a, b, c) {
      if (a === l) {
        console.log('last');
        return $gallery = $('@gallery').isotope({
          itemSelector: '.gallery-item',
          masonry: {
            columnWidth: 280,
            gutter: 10
          }
        });
      }
    }
  });
});

$(function() {
  var top, w;
  if ($('.hero').length) {
    w = $(window);
    top = $('.hero').offset().top;
    return w.on('scroll', function(e) {
      if ($('@headerInteractive').hasClass('is-visible')) {
        if (w.scrollTop() > 50) {
          return $('@toggleBlock[data-target="headerInteractive"]').click();
        }
      }
    });
  }
});

$(function() {
  if ($('@scrollToTop').length) {
    return $('@scrollToTop').on('click', function() {
      return $('body').animate({
        scrollTop: 0
      }, 300);
    });
  }
});

$(function() {
  return $('@request').on('submit', function(e, data) {
    var modalRole;
    console.log(e, data);
    modalRole = $('@request').closest('@modal').roles()[1];
    hideBlock(modalRole);
    showBlock('thanks');
    return false;
  });
});

$(function() {
  $('@toSummer').on('click', function() {
    return $('@headerNav').addClass('headerNav--summer');
  });
  return $('@toWinter').on('click', function() {
    return $('@headerNav').removeClass('headerNav--summer');
  });
});

$(function() {
  return $('#test').on('click', function() {
    return console.log('123');
  });
});
