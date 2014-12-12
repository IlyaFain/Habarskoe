$ ->
	$showBlockLinks = $('@showBlock')
	$hideBlockLinks = $('@hideBlock')
	$switchBlockLinks = $('@switchBlock')
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

	$switchBlockLinks.on 'click', ->
		targetRole = $(this).attr('data-target')
		targetsRole = $(this).attr('data-targets')
		$('@'+targetsRole).removeClass('is-visible').filter('@'+targetRole).addClass('is-visible')
		$('[data-targets="'+targetsRole+'"]').removeClass('is-active').filter($(this)).addClass('is-active')



$ ->
	swiper = $('@swiper').swiper
		mode: 'horizontal'
		loop: false
		slidesPerView: 3
		calculateHeight: true
		visibilityFullFit: false
		createPagination: true

