export const passLink = (name: string, link: string) => {
  const registrationHTML = `
  <div style="background-color:white; padding-bottom:2rem;font-family:lato ">
    <div class="container" style ="margin: auto; color: black; margin: auto; background-color:white; width: 80%; height: 80%; border-radius: 0.4rem;
    box-shadow: 1px 2px whitesmoke; margin-top:1rem;border: 2px solid rgb(237, 230, 230) " >
    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
      <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
  <head> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> </head>
  
  <h1 class="header-text" style = "font-family: 'Lato'; text-align: center;padding-top:2rem; ">You're in good crypto company</h1>
  <div class="btnContainer" style=" padding:1rem;text-align: center;border-radius: 25px;" ><img style= "margin: auto; width:80%;
  height: 90%; display:block;border-radius: 25px; ";
      class="imgClass"
      src=https://res.cloudinary.com/brosj/image/upload/v1652113202/LightPay_zcdcdd.jpg
    /></div>
  
    <h2 style = " margin: auto; padding:2rem;text-align: center; font-family: 'Lato';"  >Hi ${name}, <br>Activate your account to start your crypto
    journey on LightPay.</h2>

  <div class="btnContainer" ><a href='${link}'style=" text-decoration: none; cursor: pointer; background-color: #01051A; border: none; border-radius: 8px; 
  margin-top: 6rem; color: white; padding: 15px; text-align: center;  
  display:block; font-size: 16px; margin:auto; width: 250px; min-width: 250px;" >Activate your account</a> <br></br>
  </div>
  
  
  <hr class="horizonal-line" />
  
  <p style="padding:1rem 2rem; font-family: 'Lato';">What's next?</p>
  <h3  style="font-family: 'Lato'; padding:0rem 2rem;text-align: center;">Once active, your account is the gateway to our
    universe of crypto assets and services that help you build your financial freedom.</h3>
  <h3  style="font-family: 'Lato'; padding:0rem 2rem;text-align: center;">Verify your identity to access more features. It's easy, secure and
  faster than you might think. Once verified, you can buy and sell crypto and use multiple payment methods.</h3><br></br>


  <hr class="horizonal-line" />
  
  <div class="third-section" style=" display: flex;
  flex-direction: row; padding: 2rem;font-family: 'Lato'; ">
    <div>
      <p>Explore our diverse assets, with more added regularly.</p>
    </div>
    <div>
      <p style="font-family: 'Lato';">Get Bitcoin, ETH or Doge using your local currency.</p>
    </div>
    <div>
      <p style="font-family: 'Lato';">Master the space with our sharp crypto guides.
      </p>
    </div>
  </div>
  </div>

  <div> <p style=" text-align: center;font-family: 'Lato';" >Copyright &copy; 2022 LightPay, Inc.</p>
  </div>
  </div>
  `;

  return registrationHTML;
};
