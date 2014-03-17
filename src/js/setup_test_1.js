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

// setup_test_1
define(['ongoing'], function(task){

    var setup_test_1 = function(thisapp){

        /**
            Some AUX functions
         */

        /**
            Test 1 - Task defined, no failure handler
         */
        var t1 = task( function(result, call_when_done, call_if_fail){
            var but_ok = document.querySelector("#but1-ok");
            var but_fail = document.querySelector("#but1-fail");
   
            var listenerOK = function(evt){
                console.log("click");
                call_when_done("button 1 OK clicked, with previous result: "+result);
            };
            but_ok.addEventListener("click", listenerOK);

            var listenerFAIL = function(evt){
                console.log("click");
                call_if_fail("FAILED! Wrong button clicked");
            };
            but_fail.addEventListener("click", listenerFAIL);

            // CLEANUP! ("this" is "this task")
            this.on("cleanup", function(){
                // TODO: remove button event listeners
                console.log("TODO: cleanup");
                but_ok.removeEventListener("click",listenerOK);
                but_fail.removeEventListener("click",listenerFAIL);
                but_ok.remove();
                but_fail.remove();
            }); 
        });

        console.log(t1); 
        
        t1.go("hola");
        // Here the task is ASYNC, so we can register the "done" listener afterwards!!!
        //  as the task will not complete immediately
        // This is subtle
        t1.on("done",function(result){
            console.log("done", result);
        });
        t1.on("fail",function(failure){
            console.log("done", failure);
        });


        /**
            Test 2 - Bypass (both task and failure handler)
         */
        var t2_a = task();
        var t2_a_fail = task();
        var t2_b = task(null,null);
        var t2_b_fail = task(null,null);

        // Here the task is SYNCHRONOUS, so we need to register the listener BEFOREHAND!!!
        // This is subtle!!
        t2_a.on("done", function(result){
            console.log("t2_a",result);
        });
        t2_a.go("bypass a");
        t2_a_fail.on("fail", function(failure){
            console.log("t2_a_fail",failure);
        });
        t2_a_fail.catch("bypass a fail");
        t2_b.on("done", function(result){
            console.log("t2_b",result);
        });
        t2_b.go("bypass b");
        t2_b_fail.on("fail", function(failure){
            console.log("t2_b_fail",failure);
        });
        t2_b_fail.catch("bypass b fail");

        /**
            Test 3 - Clone and next
         */
        //t3_1 = t1.clone(); // This is confusing as it attaches to the same buttons
        
        var t3_1 = task( function(result, call_when_done, call_if_fail){
            var but_ok = document.querySelector("#but3-ok");
            var but_fail = document.querySelector("#but3-fail");
   
            var listenerOK = function(evt){
                console.log("click");
                call_when_done("button 1 OK clicked, with previous result: "+result);
            };
            but_ok.addEventListener("click", listenerOK);

            var listenerFAIL = function(evt){
                console.log("click");
                call_if_fail("FAILED! Wrong button clicked");
            };
            but_fail.addEventListener("click", listenerFAIL);

            // CLEANUP! ("this" is "this task")
            this.on("cleanup", function(){
                console.log("TODO: cleanup");
                but_ok.removeEventListener("click",listenerOK);
                but_fail.removeEventListener("click",listenerFAIL);
                but_ok.remove();
                but_fail.remove();
            }); 
        });
        console.log(t3_1);
        t3_2 = task(
            function(result, cwd, cif){ 
                var but1 = document.createElement("button");
                but1.innerHTML = "Next Task";
                var but2 = document.createElement("button");
                but2.innerHTML = "Next Task THROWING an error";
                document.body.appendChild(but1); 
                document.body.appendChild(but2); 

                but1.addEventListener("click", function(evt){
                    cwd("t3_2 was OK. Previous result: "+result);
                });
                but2.addEventListener("click", function(evt){
                    cif("t3_2 was WrOnG! Even though the previous result was fine: "+result);
                });
            },
            function(failure, cwd, cif){ 
                var but1 = document.createElement("button");
                but1.innerHTML = "Next Task Cathing previous error";
                var but2 = document.createElement("button");
                but2.innerHTML = "Next Task RELAYING previous error";
                document.body.appendChild(but1); 
                document.body.appendChild(but2); 
                but1.addEventListener("click", function(evt){
                    cwd("t3_2 recovering from failure", failure);
                });
                but2.addEventListener("click", function(evt){
                    cif("t3_2 relaying failure", failure);
                });
            }
        );
        t3_final = task(
            function(result, cwd, cif){
                alert("T3: SUCCESS:"+result);   
                cwd(result);
            },
            function(failure, cwd, cif){
                alert("T3: FAIL:"+failure);   
                cif(failure);
            }
        );
        // This one is to check setting next task on resolved task: NOT useful this way, see below
        t3_final2 = task(
            function(result, cwd, cif){
                alert("T3-bis: SUCCESS:"+result);   
                cwd(result);
            },
            function(failure, cwd, cif){
                alert("T3-bis: FAIL:"+failure);   
                cif(failure);
            }
        );

        t3_1.next( t3_2 ).next( t3_final);
        t3_1.go("seed");
        // Next on completed task! NO! --> This is a next on a completed task... as previous go is async
        //t3_final.next(t3_final2);
         
        // Try setting next task on completed task, using completed tasks from test 2
        t2_a.next(t3_final2); 

    };
    return setup_test_1;
});

