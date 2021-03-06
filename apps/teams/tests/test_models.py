# Amara, universalsubtitles.org
#
# Copyright (C) 2017 Participatory Culture Foundation
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see
# http://www.gnu.org/licenses/agpl-3.0.html.

from django.test import TestCase

from utils.factories import *
from utils.test_utils import *
import teams.signals

class UpdateSettingsTest(TestCase):
    @mock_handler(teams.signals.team_settings_changed)
    def setUp(self, signal_handler):
        self.user = UserFactory()
        self.team = TeamFactory(admin=self.user,
                                is_visible=True)
        self.signal_handler = signal_handler

    def change_settings(self, **attrs):
        initial_settings = self.team.get_settings()
        for name, value in attrs.items():
            setattr(self.team, name, value)
        self.team.save()
        self.team.handle_settings_changes(self.user, initial_settings)

    def test_update_settings(self):
        self.change_settings(is_visible=False)
        # Check the signal emission
        assert_equal(self.signal_handler.call_args, mock.call(
            signal=teams.signals.team_settings_changed,
            sender=self.team,
            user=self.user,
            changed_settings={'is_visible': False},
            old_settings={'is_visible': True},
        ))

    def test_no_changes(self):
        self.change_settings(is_visible=True)
        assert_false(self.signal_handler.called)
