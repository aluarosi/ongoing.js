/**
 * This file is part of ongoing.js
 * (Small JavaScript library for handling a?sync tasks)
 * https://github.com/aluarosi/ongoing.js
 * 
 * Copyright (C) 2014 Alvaro Santamaria Herrero (aluarosi)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// main
require.config({
    urlBase: "js",
    paths: {
    }
});

require([   
            'acti0',
            'setup_test_1'
            ], 
            function(
                acti0, 
                setup_test_1
            ){

    var app = acti0.app;

    // CONFIG
    app.setConfig({
    }); 
    // SETUP
    app.on('setup', setup_test_1);

    // RUN
    app.run();

});
