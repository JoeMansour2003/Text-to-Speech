// Code snippet is using the ConvertAPI JavaScript Client: https://github.com/ConvertAPI/convertapi-js

 
import ConvertApi from 'convertapi-js'
let convertApi = ConvertApi.auth('LFEMm4oKMo72VBtk')
let params = convertApi.createParams()
params.add('File', elFileInput.files[0]);
let result = await convertApi.convert('pdf', 'txt', params)