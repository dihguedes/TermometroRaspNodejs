const  nodemailer  = require('nodemailer');
const  sensor = require('node-dht-sensor');
const  mysql = require('mysql');
var    Temp_ant = 0 ;
const  connection = mysql.createConnection({
	host    :'127.0.0.1',
	port 	:3306,
	user	:'user',
	password:'senha',
	database:'temp' 
});
const transporter = nodemailer.createTransport({
	host: "smtp.com",
	port: "587",
	secure: false, 
	auth: {
		user:"email",
		pass:"senha"
	},
	tls: {rejectUnauthorized: false}
});


 connection.connect(function(err){
                if(err) return cosole.log(err);
                console.log('Conectado');
        })
function addRows(){
	sensor.read(11, 25, function(err, temperature, humidity) {
	Temp = temperature.toFixed(1);
	   	 if (!err) {
	       		const sql = "INSERT INTO temp_umid(temp_now, umid_now) VALUES ("+temperature.toFixed(1)+"," +humidity.toFixed(1)+")";

			connection.query(sql, function (error, results, fields){
				if(error) return console.log(error);
				
				
			});
		if (Temp > 25 && Temp > Temp_ant){
			const mailOptions ={
			        from: 'emailorig',
      			        to:  'emaildest',
 			        subject: 'Temperatura do cpd',
      			        text:'Temperatura do cpd esta acima do limite!! Temperatura atual: '+ Temp + '°C'

			};
			 transporter.sendMail(mailOptions, function(error, info){
                                        if(error){
                                                console.log(error);
                                        }
                                        else{
                                                console.log('Email enviado: '+ info.response);
                                        }
					Temp_ant= Temp;
                                });
		}
		}
	});
      t = setTimeout(addRows, 60000);
}

addRows();

