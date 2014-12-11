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
  var $hideBlockLinks, $showBlockLinks, $toggleBlockLinks;
  $showBlockLinks = $('@showBlock');
  $hideBlockLinks = $('@hideBlock');
  $toggleBlockLinks = $('@toggleBlock');
  $showBlockLinks.on('click', function() {
    var targetRole;
    targetRole = $(this).attr('data-target');
    return $('@' + targetRole).addClass('is-visible');
  });
  $hideBlockLinks.on('click', function() {
    var targetRole;
    targetRole = $(this).attr('data-target');
    return $('@' + targetRole).removeClass('is-visible');
  });
  return $toggleBlockLinks.on('click', function() {
    var targetRole;
    targetRole = $(this).attr('data-target');
    $('@' + targetRole).toggleClass('is-visible');
    return $(this).toggleClass('is-active');
  });
});

$(function() {
  var swiper;
  return swiper = $('@swiper').swiper({
    mode: 'horizontal',
    loop: false,
    slidesPerView: 3,
    calculateHeight: true,
    visibilityFullFit: false,
    createPagination: true
  });
});
