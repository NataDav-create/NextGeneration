

<?php
$formName = $_POST['nameForm'];
$userName = $_POST['userName'];
$userEmail = $_POST['userEmail'];
$userPhone = $_POST['userPhone'];
// $userName2 = $_POST['modalName'];
// $userEmail2 = $_POST['modalEmail'];
// $userPhone2 = $_POST['modalPhone'];


// Load Composer's autoloader
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer\PHPMailer\PHPMailer();
$mail->CharSet = 'utf-8';

try {
    //Server settings
    $mail->SMTPDebug = 0;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'nata.web.des@gmail.com';                     // SMTP username
    $mail->Password   = 'GloAcademy2020';                               // SMTP password
    $mail->SMTPSecure = 'ssl';         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
    $mail->Port       = 465;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('nata.web.des@gmail.com', 'Natalia');
    $mail->addAddress('davydovanatalia063@gmail.com');     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Новая заявка с сайта';
    $mail->Body    = "Имя пользователя: ${userName}, его телефон: ${userPhone}. Его почта: ${userEmail}";

    // if ($formName == 'modal__form'){
    //   $mail->Body    = "Пользователь заказал звонок. Имя пользователя: ${userName}, его телефон: ${userPhone}. Его почта: ${userEmail}";
    // } 
    // else if ($formName == 'modal__form2'){ 
    //   $mail->Body    = "Имя пользователя: ${userName}, его телефон: ${userPhone}, Его почта: ${userEmail}";
    // } 
 


    if ($mail->send()) {
      header('Location: thanks.html');
    } else {
      echo "Письмо не отправлено, есть ошибка. Код ошибки: {$mail->ErrorInfo}";
    }

} catch (Exception $e) {
    echo "Письмо не отправлено, есть ошибка. Код ошибки: {$mail->ErrorInfo}";
}
  ?>

