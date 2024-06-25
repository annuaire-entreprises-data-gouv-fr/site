import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import { IEORIValidation } from '#models/eori-validation';
import { Siret } from '#utils/helpers';
import httpClient from '#utils/network';

function createSOAPRequest(eoriNumber: string) {
  return `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
  <soap:Body> 
    <ev:validateEORI xmlns:ev="http://eori.ws.eos.dds.s/"> 
      <ev:eori>${eoriNumber}</ev:eori> 
    </ev:validateEORI> 
  </soap:Body> 
</soap:Envelope>
`;
}

/**
 * Call VIES to validate a French TVA number
 * @param tva
 * @returns TVA number if valid else null
 */
const clientEORI = async (siret: Siret): Promise<IEORIValidation | null> => {
  const data = await httpClient<string>({
    url: routes.eori,
    method: 'POST',
    data: createSOAPRequest('FR' + siret),
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: '',
    },
  });
  const result = data.match(/<result>[\s\S]*?<\/result>/)?.[0];

  if (!result || !result.includes('<status>')) {
    return null;
  }

  const isValid = result.includes('<status>0</status>');
  return {
    eori: siret,
    isValid,
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientEORI,
});

export { stubbedClient as clientEORI };

/* SOAP Response type
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
   <S:Body>
      <ns0:validateEORIResponse xmlns:ns0="http://eori.ws.eos.dds.s/">
         <return>
            <requestDate>25/06/2024</requestDate>
            <result>
               <eori>DE123456</eori>
               <status>1</status>
               <statusDescr>Not valid</statusDescr>
            </result>
            <result>
               <eori>IT123456789</eori>
               <status>1</status>
               <statusDescr>Not valid</statusDescr>
            </result>
         </return>
      </ns0:validateEORIResponse>
   </S:Body>
</S:Envelope>

*/
