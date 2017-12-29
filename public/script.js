$(document).ready(function() {
    $('.api-endpoint').text(API_ENDPOINT);

    var placeholder = [
        './assets/placeholder/1.jpg',
        './assets/placeholder/2.jpg',
        './assets/placeholder/3.jpg',
        './assets/placeholder/4.jpg',
        './assets/placeholder/5.jpg',
        './assets/placeholder/6.jpg',
    ];
    var lastPlaceholder = 0;

    // Preload placeholder images
    placeholder.forEach(function (image) {
        $('<img />')[0].src = image;
    });

    var maleAvatar = new Avatars(Avatars.SPRITE_SETS.male, { size: 200 });
    var femaleAvatar = new Avatars(Avatars.SPRITE_SETS.female, { size: 200 });

    // Seed Form
    var maleAvatarImage = $('#avatar-male');
    var femaleAvatarImage = $('#avatar-female');

    var seedInput = $('#seed');
    var seedSpan = $('.seed');

    var createAvatars = function() {
        var seed = seedInput.val();

        maleAvatar.create(seedInput.val(), {}, function (err, canvas) {
            if (seed == seedInput.val()) {
                maleAvatarImage.attr('src', canvas.toDataURL());
            }
        });

        femaleAvatar.create(seedInput.val(), {}, function (err, canvas) {
            if (seed == seedInput.val()) {
                femaleAvatarImage.attr('src', canvas.toDataURL());
            }
        });

        seedSpan.text(encodeURIComponent(seed || 'custom-seed'));
    }

    seedInput.on('input', createAvatars);

    createAvatars();

    // Infinite
    var infinite = $('#infinite');
    var infiniteDummy = infinite.children().first();
    var infiniteChance = new Chance('fixed-seed');

    var fillInfinite = function() {
        // documentBottomPosition + 800 preload area
        var documentBottomPosition = $(window).scrollTop() + $(window).height() + 800;

        while (infiniteDummy.offset().top < documentBottomPosition) {
            var newAvatar = infiniteDummy.clone();

            // Set new placeholder image
            if (lastPlaceholder == placeholder.length - 1) {
                lastPlaceholder = 0;
            } else {
                lastPlaceholder++;
            }

            // Load image from api
            var newAvatarGender = infiniteChance.pickone(['male', 'female']);
            var newAvatarName = infiniteChance.name({ gender: newAvatarGender });
            var newAvatarUrl = API_ENDPOINT+'v1/'+newAvatarGender+'/'+encodeURIComponent(newAvatarName)+'/200.png';

            newAvatar
                .find('a')
                .attr('href', newAvatarUrl);

            var newAvatarImg = newAvatar
                .find('img')
                .attr('src', placeholder[lastPlaceholder])
                .attr('alt', newAvatarName);

            newAvatar
                .find('.name')
                .text(newAvatarName);

            $('<img />')
                .on('load', (function(newAvatarImg, newAvatarUrl) {
                    return function() {
                        newAvatarImg.attr('src', newAvatarUrl);
                    };
                })(newAvatarImg, newAvatarUrl))
                .attr('src', newAvatarUrl);
            
            newAvatar.insertBefore(infiniteDummy);
        }
    }

    $(document).on('scroll', fillInfinite);

    fillInfinite();
});
