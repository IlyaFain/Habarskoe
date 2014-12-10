$ ->
	$showBlockLinks = $('@showBlock')
	$hideBlockLinks = $('@hideBlock')
	$toggleBlockLinks = $('@toggleBlock')

	$showBlockLinks.on 'click', ->
		targetRole = $(this).attr('data-target')
		$('@'+targetRole).addClass('is-visible')

	$hideBlockLinks.on 'click', ->
		targetRole = $(this).attr('data-target')
		$('@'+targetRole).removeClass('is-visible')

	$toggleBlockLinks.on 'click', ->
		targetRole = $(this).attr('data-target')
		$('@'+targetRole).toggleClass('is-visible')
		$(this).toggleClass('is-active')


