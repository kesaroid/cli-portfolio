import config from '../../../config.json';

const sumfetch = async (args: string[]): Promise<string> => {
  if (config.ascii === 'kesaroid') {
    return `                                                  
         ,aodObo,
         ,AMMMMP~~~~
      ,MMMMMMMMA.
    ,M;'      YV'
   AM' ,OMA,
  AM|    ~VMM,.      .,ama,____,amma,..
  MML      )MMMD   .AMMMMMMMMMMMMMMMMMMD.
  VMMM    .AMMY'  ,AMMMMMMMMMMMMMMMMMMMMD
  \VMM, AMMMV'  ,AMMMMMMMMMMMMMMMMMMMMMMM,                ,
   VMMMmMMV'  ,AMY~~''  'MMMMMMMMMMMM' '~~             ,aMM                  sumfetch: summary display
    YMMMM'   AMM'        'VMMMMMMMMP'_              A,aMMMM                 -----------
    AMMM'    VMMA. YVmmmMMMMMMMMMMML MmmmY          MMMMMMM                 -----------
   ,AMMA   _,HMMMMmdMMMMMMMMMMMMMMMML'VMV'         ,MMMMMMM                  ABOUT
   AMMMA _'MMMMMMMMMMMMMMMMMMMMMMMMMMA '           MMMMMMMM                  ${config.name}
  ,AMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMa      ,,,    MMMMMMM                  ${config.title}
  AMMMMMMMMM'~'YMMMMMMMMMMMMMMMMMMMMMMA    ,AMMV    MMMMMMM                 
  VMV MMMMMV    YMMMMMMMMMMMMMMMMMMMMMY    VMMY'  adMMMMMMM                  <u><a href="${config.resume_url}" target="_blank">Resume</a></u>
   V  MMMM'       YMMMMMMMV.~~~~~~~~~,aado, V''   MMMMMMMMM                 
     aMMMMmv        YMMMMMMMm,    ,/AMMMMMA,      YMMMMMMMM                 -----------
     VMMMMM,,v       YMMMMMMMMMo oMMMMMMMMM'    a, YMMMMMMM                 
      YMMMMMY'        YMMMMMMMY'  YMMMMMMMY     MMmMMMMMMMM                  CONTACT                  
      AMMMMM  ,        ~~~~~,Kesara,~~~~~~      MMMMMMMMMMM                  <u><a href="mailto:${config.email}" target="_blank">${config.email}</a></u>
        YMMMb,d'         dMMMMMMMMMMMMMD,   a,, AMMMMMMMMMM                  <u><a href="https://github.com/${config.social.github}" target="_blank">github.com/${config.social.github}</a></u>
         YMMMMM, A       YMMMMMMMMMMMMMY   ,MMMMMMMMMMMMMMM                  <u><a href="https://linkedin.com/in/${config.social.linkedin}" target="_blank">linkedin.com/in/${config.social.linkedin}</a></u>
        AMMMMMMMMM         ~~~~'   ~~~~'   AMMMMMMMMMMMMMMM                 
         VMMMMMM'  ,A,                  ,,AMMMMMMMMMMMMMMMM                 -----------
      ,AMMMMMMMMMMMMMMA,       ,aAMMMMMMMMMMMMMMMMMMMMMMMMM                  DONATE 
    ,AMMMMMMMMMMMMMMMMMMA,    AMMMMMMMMMMMMMMMMMMMMMMMMMMMM                  <u><a href="${config.donate_urls.paypal}" target="_blank">${config.donate_urls.paypal}</a></u>
  ,AMMMMMMMMMMMMMMMMMMMMMA   AMMMMMMMMMMMMMMMMMMMMMMMMMMMMM                 <i><b>$</b></i> <u><a href="${config.donate_urls.cashapp}" target="_blank">${config.donate_urls.cashapp}</a></u>
 AMMMMMMMMMMMMMMMMMMMMMMMMAaAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

`;
  }
};

export default sumfetch;
