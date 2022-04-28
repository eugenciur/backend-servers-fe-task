import servers from '../mocks/servers.json';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, Math.ceil(Math.random() * ms)));
};

const getChanceToFail = (percent) => {
  return Math.ceil(Math.random() * 100) <= percent;
};

const getSuccessResponse = () => {
  return {
    data: servers,
    totalCount: servers.length
  };
};

const getErrorResponse = () => {
  return {
    message: 'Ooops, something went wrong. Please try again.',
    statusCode: 501,
  };
};

const createResponse = async () => {
  await sleep(6000);
  const result = getChanceToFail(30) ? getErrorResponse() : getSuccessResponse();

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'OPTIONS' && event.httpMethod !== 'GET') {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 405,
      body: JSON.stringify({message: 'Method not allowed!'}),
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: 'ok'
    };
  }

  if (event.httpMethod === 'GET') {
    return await createResponse();
  }
};
