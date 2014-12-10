"use strict"

# Cахар для after 1000, ->
$ ->
	window.after = (ms, callback) ->
		setTimeout callback, ms


# Добавляет `@data-role` альясы в джейквери
# https://github.com/kossnocorp/role
$ ->
	rewriteSelector = (context, name, pos) ->
		original = context[name]
		unless original then return

		context[name] = ->
			arguments[pos] = arguments[pos].replace /@@([\w\u00c0-\uFFFF\-]+)/g, '[data-block~="$1"]'
			arguments[pos] = arguments[pos].replace /@([\w\u00c0-\uFFFF\-]+)/g, '[data-role~="$1"]'
			original.apply context, arguments
		$.extend context[name], original

	rewriteSelector $, 'find', 0
	rewriteSelector $, 'multiFilter', 0
	rewriteSelector $.find, 'matchesSelector', 1
	rewriteSelector $.find, 'matches', 0

	parse = (roleString, without) ->
		role = undefined
		result = []
		roles = $.trim(roleString).split(/\s+/)
		i = 0
		while i < roles.length
			role = roles[i]
			if not ~$.inArray(role, result) and (not without or not ~$.inArray(role, without))
				result.push role
			i++
		result

	$.extend $.fn,
		roles: ->
			parse @attr('data-role')

		hasRole: (roleName) ->
			roles = parse(roleName)
			i = 0
			while i < roles.length
				unless this.is('@' + roles[i])
					return false
				i++
			true

		addRole: (roleName) ->
			if this.hasRole(roleName)
				return this
			this.each (_, element) ->
				$el = $(element)
				roles = parse($el.attr('data-role') + ' ' + roleName).join(' ')
				$el.attr('data-role', roles)
				return

		removeRole: (roleName) ->
			unless this.hasRole(roleName)
				return this
			this.each (_, element) ->
				$el = $(element)
				roles = parse($el.attr('data-role'), parse(roleName)).join(' ')
				$el.attr('data-role', roles)
				return

		toggleRole: (roleName) ->
			roles = parse(roleName)
			i = 0
			while i < roles.length
				callFunction = (if this.hasRole(roles[i]) then 'removeRole' else 'addRole')
				this[callFunction].call this, roles[i]
				i++
			this
