import { isCommandEnabled } from '../commandConfig';
import config from '../../../config.json';

export const SUMFETCH_COMMAND = 'sumfetch' as const;

const linkClass = 'text-light-blue dark:text-dark-blue underline break-all';

const SUMFETCH_DESKTOP = `                                                  
         ,aodObo,
         ,AMMMMP~~~~
      ,MMMMMMMMA.
    ,M;'      YV'
   AM' ,OMA,
  AM|    ~VMM,.      .,ama,____,amma,..
  MML      )MMMD   .AMMMMMMMMMMMMMMMMMMD.
  VMMM    .AMMY'  ,AMMMMMMMMMMMMMMMMMMMMD
  \\VMM, AMMMV'  ,AMMMMMMMMMMMMMMMMMMMMMMM,                ,
  VMMMmMMV'  ,AMY~~''  'MMMMMMMMMMMM' '~~             ,aMM                   <u><a href="${config.readmeUrl}" target="_blank">About Me</a></u>
    YMMMM'   AMM'        'VMMMMMMMMP'_              A,aMMMM                 -----------
    AMMM'    VMMA. YVmmmMMMMMMMMMMML MmmmY          MMMMMMM                 -----------
   ,AMMA   _,HMMMMmdMMMMMMMMMMMMMMMML'VMV'         ,MMMMMMM                 
   AMMMA _'MMMMMMMMMMMMMMMMMMMMMMMMMMA '           MMMMMMMM                  ${config.name}
  ,AMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMa      ,,,    MMMMMMM                  ${config.subtitle}
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

function formatSumfetchMobile(): string {
  return (
    `<div class="whitespace-normal break-words">` +
    `<div> <u><a class="${linkClass}" href="${config.readmeUrl}" target="_blank">About Me</a></u></div>` +
    `<div class="opacity-60">-----------</div>` +
    `<div> ${config.name}</div>` +
    `<div> ${config.subtitle}</div>` +
    `<div> <u><a class="${linkClass}" href="${config.resume_url}" target="_blank">Resume</a></u></div>` +
    `<div class="mt-2"> CONTACT</div>` +
    `<div> <u><a class="${linkClass}" href="mailto:${config.email}" target="_blank">${config.email}</a></u></div>` +
    `<div> <u><a class="${linkClass}" href="https://github.com/${config.social.github}" target="_blank">github.com/${config.social.github}</a></u></div>` +
    `<div> <u><a class="${linkClass}" href="https://linkedin.com/in/${config.social.linkedin}" target="_blank">linkedin.com/in/${config.social.linkedin}</a></u></div>` +
    `<div class="mt-2"> DONATE</div>` +
    `<div> <u><a class="${linkClass}" href="${config.donate_urls.paypal}" target="_blank">${config.donate_urls.paypal}</a></u></div>` +
    `<div><i><b>$</b></i> <u><a class="${linkClass}" href="${config.donate_urls.cashapp}" target="_blank">${config.donate_urls.cashapp}</a></u></div>` +
    `</div>`
  );
}

export const sumfetch = async (): Promise<string> => {
  if (!isCommandEnabled(SUMFETCH_COMMAND)) {
    return `shell: command not found: ${SUMFETCH_COMMAND}. Try 'help' to get started.`;
  }

  return (
    `<pre class="m-0 hidden whitespace-pre sm:block">${SUMFETCH_DESKTOP}</pre>` +
    `<div class="sm:hidden">${formatSumfetchMobile()}</div>`
  );
};
