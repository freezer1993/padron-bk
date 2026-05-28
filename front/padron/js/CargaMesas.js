function openModal() {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}


function cargarOrden() {
    var idMesa = $('#idMesa').val();
    var idLocal = $('#idLocal').val();
    var idOrden = $('#idOrden').val();
    var idUsuario = 1;

    if(idOrden === ''){
        $('#output').html("<div class=\"alert alert-warning\" role=\"alert\"> El campo orden no puede estar vacio </div>");
        $("#idOrden").focus();
    }else{
    //alert(idMesa);
    const ordenMesa = {
        "local" : idLocal,
        "mesa" : idMesa,
        "orden" : idOrden,
        "user" : idUsuario
    }
    openModal();
    $('#output').html("");
    setTimeout(function() {
        $('#output').fadeIn(1);
    },1);

    const req = new XMLHttpRequest();
    req.open('POST', 'http://173.214.162.219:3000/padron/ordenins');
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5hY2hvIiwiaWF0IjoxNjcwNzc2MzE1LCJleHAiOjE2NzA4NjI3MTV9.KKwsEp1riTt6zpDSSuxRLv0EJcvfzVda9hjllN8I1eU');
    req.addEventListener('load', function () {
        if (req.readyState === 4 && req.status === 200) {
            const res = JSON.parse(req.responseText);
            console.log(res);
            //document.getElementById('output').textContent = ( "<span class='red'>Hello <b>Again</b></span>" );
            $('#output').html("<div class=\"alert alert-success\" role=\"alert\"> Se cargo con Exito el nro de orden "+idOrden+"  </div>");
            //listarCargaMesa();
            $.each(res.data, function (index, item) {
                var el = `
                    <tr>
                      <td>${item.Mesa}</td>
                      <td>${item.Local}</td>
                      <td>${item.Orden}</td>
                      <td>${item.User}</td>
                    </tr>
                `;

                $('#table > tbody').append(el);
            });
            setTimeout(function () {
                $('#output').fadeOut(1000);
            }, 2500);
            closeModal();
        } else {
            closeModal();
            const res = JSON.parse(req.responseText);
            console.log(res.outError.detail);
            $('#output').html("<div class=\"alert alert-danger\" role=\"alert\"> "+res.outError.detail+"  </div>");
            //listarCargaMesa();
            setTimeout(function () {
                $('#output').fadeOut(1000);
            }, 15000);
        }
         
    });
    req.send(JSON.stringify(ordenMesa));
    }
};

/*function listarCargaMesa() {
    const req = new XMLHttpRequest();
    req.open('GET', 'https://reqres.in/api/users');
    req.addEventListener('load', function () {
        if (req.readyState === 4 && req.status === 200) {
            const res = JSON.parse(req.responseText);
            console.log(res);

            $.each(res.data, function (index, item) {
                var el = `
                    <tr>
                      <td>${item.id}</td>
                      <td>${item.email}</td>
                      <td>${item.first_name}</td>
                      <td>${item.last_name}</td>
                    </tr>
                `;

                $('#table > tbody').append(el);
            });

        } else {
            console.log("Request error");
        }
    });
    req.send();
};*/        