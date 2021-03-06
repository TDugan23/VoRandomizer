var ruleList_final = [];
var ruleList_raw = [];
var baseurl = 'http://rms.tomtomgroup.com/';
var skiplist = [];

var b = "HawleyB, HeatherB, OwenC, OrionC, MatthewF, AnthonyH, EricaK, KayleeL, MasonP, TheresaS, MollyT, LilyWM, JoshuaW";
var d = "BittyA, AldenC, EveC, AbigailD, AndrewF, AlyanaH, ChanceJ, IsabelleJ, OliviaM, AbigailM, SeanN, AdareO, MagnoliaR, AldenS, NatalieS, DavisT, TrevorW, MackenzieY";
var f = "ZayneA, EvanA, LillyB, CharlotteC, MichaelC, HaleighC, JoshuaD, TylerG, BlakeH, LillyH, SamM, MargaretO, ElizabethP, ErykR, JohnS, OwenS, HaleyS, GunnarW";
var g = "CharlieA, BenjaminB, ElyC, HannahC, WillC, ElijahD, IssacE, AdriannaG, AnnaH, CassandraH, ClaytonL, ClaudiaM, HayleyM, DharmaN, AlecP, IvyR, TimothyR, OwenT, GriffinVN";
var h = "NicholasB, TristinB, ChristianB, SilasB, LukeB, LolaD, AudreyE, SofiaK, DaneilL, JosephM, CalebM, TravonO, MollieP, MaceyP, MadisenR, AliceS, AnnaW, SamanthaY, NoraZ";

var theGroupSize = 1;

$(document).ready(function() {

      $('#blockSelector').on('change', function() {

        // populate textarea with premade student lists
        switch (this.value) {
            case "b":
              $("#allStudents").text(b);
              break;
            case "d":
              $("#allStudents").text(d);
              break;
            case "f":
              $("#allStudents").text(f);
              break;
            case "g":
              $("#allStudents").text(g);
              break;
            case "h":
              $("#allStudents").text(h);
              break;
        }

      })

      $('#sizeSelector').on('change', function() {

        // grab group size
        switch (this.value) {
            case "2":
              theGroupSize = 2;
              break;
            case "3":
              theGroupSize = 3;
              break;
            case "4":
              theGroupSize = 4;
              break;
            case "5":
              theGroupSize = 5;
              break;
        }

      })


        createGroups();
        //  printRules();
        $("#csv_filename").val('degradation_export.csv');
        $("search").val('');
        $(window).resize(function() {
            repositionBody()
        });
        $(window).load(function() {
            repositionBody()
        });
    }
);




function createGroups() {

    // get student list from textarea
    var rClass = $('#allStudents').val().split(',');

    // create random number array
    var rNums = [];
    for (var i = 0; i < rClass.length; i++) {
        rNums[i] = Math.random();
    }
    console.log(rNums);

    // sort the student list with numbers array
    var temp1, temp2;
    for (var i = 0; i < rClass.length; i++) {
        for (var j = 0; j < rClass.length; j++) {
            if (rNums[i] > rNums[j]) {
                temp1 = rNums[j];
                rNums[j] = rNums[i];
                rNums[i] = temp1;
                temp2 = rClass[j];
                rClass[j] = rClass[i];
                rClass[i] = temp2;
            }
        }
    }

    // figure out the vital stats
    var theStudentCount = rClass.length;
    var theGroupCount = Math.floor(theStudentCount / theGroupSize) + 1;
    var maxGroupSize = theGroupSize + 1;
    console.log("students: " + theStudentCount);
    console.log("desired group size: " + theGroupSize);
    console.log("max group size: " + maxGroupSize);
    console.log("group count: " + theGroupCount);

    // create empty groups of max size
    var theGroups = new Array(theGroupCount);
    for (var i = 0; i < theGroupCount; i++) {
        theGroups[i] = new Array(maxGroupSize);
    }
    console.log(theGroups);
    // the students can be distributed evenly
    if (theStudentCount % theGroupSize == 0) {
        console.log("***easy mode***")
        for (var j = 0; j < theGroupCount; j++) {
            for (var k = 0; k < theGroupSize; k++) {
                theGroups[j][k] = rClass[j * theGroupSize + k];
            }
        }
    }
    // not sure what's going on
    else if (theStudentCount % theGroupSize > theStudentCount / theGroupSize) {
        alert("OH NO - Tierney Crisis Mode - select a smaller group size - RIP");
    }
    // uneven distribution
    else {
      console.log("***spillover mode***")
      for (var i = 0; i < theStudentCount; i++) {
              theGroups[i % theGroupCount][Math.floor(i / theGroupCount)] = rClass[i];

      }
      console.log(theGroups);
      // for (var k = 0; k < theGroupSize; k++) {
      //     for (var j = 0; j < theGroupCount; j++) {
      //         theGroups[j][k] = rClass[j * theGroupSize + k];
      //     }
      //
      // }
              // console.log("***spillover mode***")
        // for (var j = 0; j < (theStudentCount / theGroupSize); j++) {
        //     for (var k = 0; k < theGroupSize; k++) {
        //         theGroups[j][k] = rClass[j * theGroupSize + k];
        //     }
        //
        // }
    }
    console.log(theGroups);

    var t = $('#ruleTable').DataTable({
        paging: false,
        ordering: false,
        autoWidth: false,
        retrieve: true,
        language: {
            "info": "Showing _TOTAL_ rules",
            "infoFiltered": "(filtered from full set of _MAX_ rules)",
            "emptyTable": " "
        },
        order: [
            [0, "asc"]
        ],
        dom: 'lrtp'
    });

    t.clear();
    $.each(theGroups, function(index, item) {
        console.log('rule:', item);
        if (item[0])
        {
        t.row.add([
            index + 1,
            stringify(item)
        ]);
      }
    })
    t.draw();

}
//
//       for (int i = 0; i < students.length % scannerResponse; i++) { // iterate through the spillover
//
//         int firstEmptySpot = 0;
//         //System.out.println(groups[i % (students.length/scannerResponse)][firstEmptySpot]);
//
//          while (groups[i % (students.length/scannerResponse)][firstEmptySpot] != null) {
//            firstEmptySpot++;
//         }
//
//
//         groups[i % (students.length/scannerResponse)][firstEmptySpot]=students[students.length-i-1];
//
//         //add spillover
//         }
//
//
// for (int j = 0; j < groups.length; j++) {
//               System.out.println("group"+ (j+1));
//               for (int k = 0; k < groups[j].length; k++){
//                 System.out.println( groups[j][k]);
//        }
//       }
//     }
//   }
// }



function stringify(lst) {
    var cleaned = new Array();
    for (var i = 0; i < lst.length; i++) {
        if (lst[i]) {
            cleaned.push(lst[i]);
        }
    }

    var s = "";
    for (var i = 0; i < cleaned.length - 1; i++) {
        var name = cleaned[i];
        s += cleaned[i].trim() + ", ";
    }
    s += cleaned[cleaned.length - 1];
    return s;
}


function repositionBody() {
    $('body').css('padding-top', parseInt($('#main-navbar').css("height")) + 10);
}


function displayFailure() {
    alert("There's a problem. Please send an email to andrewsmith@wcsu.net");
}
//
// function printRules() {
//     var t = $('#ruleTable').DataTable({
//         paging: false,
//         ordering: true,
//         autoWidth: false,
//         language: {
//             "info": "Showing _TOTAL_ rules",
//             "infoFiltered": "(filtered from full set of _MAX_ rules)",
//             "emptyTable": "...loading..."
//         },
//         order: [[0, "asc"]],
//         dom: 'lrtp'
//     });
//
//     $('#search').on( 'keyup', function () {
//         t.search( this.value ).draw();
//         info = t.page.info();
//         if(info.recordsDisplay < info.recordsTotal) {
//             $("#filterCount").html('<span class="warning">Displaying <b>' + info.recordsDisplay + '</b> of ' + info.recordsTotal + ' active rules</span>');
//         } else {
//             $("#filterCount").text('Displaying all ' + info.recordsTotal + ' active rules');
//         }
//         if (info.recordsTotal == 0) {
//             $("td:contains('...loading...')").html('no items')
//         };
//         repositionBody()
//     } );
//
//         $.each(theGroups, function(index, item) {
//             console.log('rule:', item);
//                 t.row.add([
//                   index + 1,
//                     item
//
//                 ]);
//                           }
//                         )
//
//         console.log('done adding table items');
//         t.draw();
//         info = t.page.info();
//         $("#ruleCount").text('Rule count: ' + info.recordsTotal);
//         if (info.recordsTotal == 0) {
//             $("td:contains('...loading...')").html('no items')
//         };
//         $("#filterCount").text('Displaying all ' + info.recordsTotal + ' active rules');
//         repositionBody()
//
// }
//
// function removeBadCharFromString(str) {
//     var newStr = str.replace(/\uFFFD/g, ' ');
//     return newStr;
// }
//
// function removeBadCharFromArray(arr) {
//     for (var i in arr) {
//         i = removeBadCharFromString(i);
//     }
//     return arr;
// }
//
// function getNcLinkString(input) {
//    if ($.isNumeric(input) && input.length >= 6 && input.length <= 7) {
//        output = '<a href="http://prod-mks-app-101:7001/im/issues?selection=' + input + '" target="_blank">' +  input + '</a>';
//    } else {
//        output = input;
//        console.log('unexpected NC ID:' + input);
//    }
//    return output;
// }
//
// function getQaLinkString(input) {
//    output = ''
//    if (input) {
//        if (input.length >= 5) {
//            rules = input.split(' ');
//            $.each(rules, function(key, value) {
//                if ($.isNumeric(value) && value >= 50001 &&  value <= 59999) {
//                    output = output + '<a href="http://rms.tomtomgroup.com/rms-web/wicket/bookmarkable/com.tomtom.rms.module.rule.RuleDetailPage?id=' + value + '" target="_blank">' +  value + '</a> ';
//                } else {
//                    output = output + value + ' ';
//                    console.log('unexpected QA ID: ' + value + ' in "' + input + '"');
//                }
//            });
//        } else {
//            output = input
//            console.log('unexpected QA ID:' + input);
//        }
//    } else {
//        console.log('unexpected QA ID:' + input);
//    }
//    return output;
// }
//
// function linkify(str) {
//     if (str.substring(0,4) == 'http') {
//         newstr = '<a href="http://rms.tomtomgroup.com/rms-web/wicket/bookmarkable/com.tomtom.rms.module.rule.RuleDetailPage?id=' + str + '" target="_blank">' + str + '</a>';
//     } else {
//         newstr = str;
//     }
//     return newstr
// }
//
// function getMessage(id) {
//     // console.log(latestVersions.length);
//     rule = $.grep(latestVersions, function (item, index) {
//         return item.id.toString() == id.toString();
//     })
//     return rule[0].message;
// }
