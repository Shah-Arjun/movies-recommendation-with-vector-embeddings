const axios = require('axios');

const dotenv = require('dotenv');
const { connect } = require('mongoose');
dotenv.config()



// Funnction to generate embeddings from HuggingFaceEmbeddings (384 length vector)  -> takes input and returns vector embeddings
const getEmbeddings = async(data) => {
    const apiKey = process.env.HUGGING_FACE_EMBEDDINGS

    // config object
    let config = {
        method: 'POST',
        maxBodyLength: Infinity,     //to send large data without any limit
        url: 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',   //hugging face model(all-MiniLM-L6-v2) endpoint
        headers: {           // request header
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'        // input/content/data type we sending is json
        },
        data: {     //request body
            inputs: data  // pass raw string or array of strings received to model
        }
    };


    try {
        const response = await axios.request(config);   //sends request to API and awaits for response
        console.log('\nresponse->', response.data);                                                             //debug
        return response.data;
    } catch (err) {
        console.error('HuggingFace API error:', err.response?.data || err.message);
    }
}


module.exports = { getEmbeddings };  //exporting function so can be used in another file




// getEmbeddings("spiderman movies.")  //test 


