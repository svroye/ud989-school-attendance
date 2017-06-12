/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
 (function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
        attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());




 var model ={
    days : 12,
    students: [
    "Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat","Adam the Anaconda"]
};

var view = {
    init: function(){
        this.attendance = JSON.parse(localStorage.attendance)
        this.tableHeader = document.getElementById('table-headers');
        this.tableBody = document.getElementById('table-body');
        this.studentNameColumn = document.getElementById('student-name');
        this.missedDaysColumn = document.getElementById('missed-days');
        
        var elHeader, elBody, elStudent, checkBoxes, elMissingDays, elStudentsName, elMissedCol;
        var students = octopus.getStudents();


        elStudentsName = document.createElement('th');
        elStudentsName.classList.add('name-col');
        elStudentsName.innerHTML = 'Student Name';
        this.tableHeader.appendChild(elStudentsName);

        for(var i=0; i <students.length; i++){
            elBody = document.createElement('tr');
            elBody.classList.add('student');
            this.tableBody.appendChild(elBody);

            //<td class="name-col">Slappy the Frog</td>
            elStudent = document.createElement('td');
            elStudent.classList.add('name-col');
            elStudent.textContent = students[i];
            elBody.appendChild(elStudent);

            for(var j=1; j <= octopus.getNumberOfDays(); j++) {
                checkBoxes = document.createElement('td');
                checkBoxes.classList.add('attend-col');
                checkBoxes.innerHTML = '<input type="checkbox">';
                elBody.appendChild(checkBoxes);
            }
            elMissingDays = document.createElement('td');
            elMissingDays.classList.add('missed-col');
            elMissingDays.innerHTML = 0;
            elBody.appendChild(elMissingDays);
        }

        for(var j=1; j <= octopus.getNumberOfDays(); j++){
            elHeader = document.createElement('th');
            elHeader.textContent = j;
            this.tableHeader.insertBefore(elHeader, this.missedDaysColumn);
        } 
        elMissedCol = document.createElement('th');
        elMissedCol.classList.add('missed-col');
        elMissedCol.innerHTML = 'Days Missed-col';
        this.tableHeader.appendChild(elMissedCol);

        this.checkBoxes = document.querySelectorAll('td input');
        this.checkBoxes.forEach(function(current){
            current.addEventListener('click',function(){
                octopus.updateMissedDays();
            })
        })

        this.render();
    },
    render: function(){
       $.each(this.attendance, function(name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            });
        });
       octopus.updateMissedDays();
    }
};





var octopus = {
    init: function(){
        view.init();
    },
    getNumberOfDays: function(){
        return model.days;
    },
    getStudents: function(){
        return model.students;
    },
    countMissing: function(){
        $allMissed = $('tbody .missed-col');
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
            dayChecks = $(studentRow).children('td').children('input'),
            numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    },
    updateMissedDays: function(){
        var studentRows = $('tbody .student');
        var newAttendance = {};
        var checkBoxes = document.querySelectorAll('td input');

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
            checkBoxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            checkBoxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        this.countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    }
}

octopus.init();
