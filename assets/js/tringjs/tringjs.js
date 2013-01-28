/**
 * Library written for project Tring - tring.co.nz, tringlightningbolt.com
 *
 * @author Steven Lam / http://aesphere.net
 *
 * This is the base file and should be included first. Any defaults should be initialised here.
 */

var DEBUG = false;

// Declaring TRING namespace and defaults
var TRING = TRING || { REVISION: '01' };

var API_URL = 'http://api.tringlightningbolt.com/api/v1/power/show.json';
var DEBUG_API_URL = 'http://localhost:3000/api/v1/power/show.json';

/**
 * init values hardcoded in at current since we .only have 1 property to work with.
 * Instead of an icp value being passed onwards, an auth token will be 
 * evaluated against the api which will return the appropirate property.
 */
var icp = '0000067894TR-CE6';

TRING.API_URL = (DEBUG == true)? DEBUG_API_URL : API_URL;
