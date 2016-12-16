/*
 * Amara, universalsubtitles.org
 *
 * Copyright (C) 2016 Participatory Culture Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see
 * http://www.gnu.org/licenses/agpl-3.0.html.
 */

(function($) {

$.behaviors('.styleGuide', styleGuide);

function styleGuide(container) {

    $('.styleGuide-navLink', container).click(function(evt) {
        var link = $(this);
        // Remove old active classes
        $('.active', container).removeClass('active');
        // Add new active classes
        link.addClass('active');
        $(link.attr('href')).addClass('active');

        // TODO - refactor the use of a global contentUpdate event
        $(document).trigger("contentUpdate");

        evt.preventDefault();
    });
    $('.styleGuide-navLink', container).filter(':first').click();
}

})(jQuery);

