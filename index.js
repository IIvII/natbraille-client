var request = require('request');
function NatbrailleClient(config){
    this.config = {
	protocol : config.protocol || "http",
	baseurl : config.baseurl,
	user : config.user,
	password : config.password
    };
    return this;
}
NatbrailleClient.prototype.privatePath1 = function(path){
    return [this.config.protocol,'://',this.config.user,':',this.config.password,'@',
	    this.config.baseurl,'private','/',
	    path].join('');
}
NatbrailleClient.prototype.privatePath2 = function(path){
    return [this.config.protocol,'://',this.config.user,':',this.config.password,'@',
	    this.config.baseurl,'private','/',
	    '~',this.config.user,'/',
	    path].join('');
}
NatbrailleClient.prototype.publicPath1 = function(path){
    return [this.config.protocol,'://',
	    this.config.baseurl,'public','/',
	    path].join('');
}
NatbrailleClient.prototype.publicPath2 = function(path){
    return [this.config.protocol,'://',
	    this.config.baseurl,'public','/',
	    '~',this.config.user,'/',
	    path].join('');
}
NatbrailleClient.prototype.user = function(cb){
    request.get({ url:this.privatePath1('user/'), json:true }, cb);
}
NatbrailleClient.prototype.sources = function(cb){
    request.get({ url:this.privatePath2('source/'), json:true }, cb);
}
NatbrailleClient.prototype.addSourceFromStream  = function(rs,opts,cb){
    var formData = { file: rs };
    if (!(opts.mimeType == undefined)){
	formData.mimeType =  opts.mimeType;
    };
    if (!(opts.charset == undefined)){
	formData.charset =  opts.charset;
    };
    request.post( { url:this.privatePath2('source/'), formData: formData, json:true }, cb)
}
/*
NatbrailleClient.prototype.addSourceFromFile  = function(source,cb){
    this.addSourceFromStream(fs.createReadStream(source),cb);
}
*/
NatbrailleClient.prototype.removeSource = function(id,cb){
    request.delete({url:this.privatePath2('source/'+id),json:true},cb)
}
NatbrailleClient.prototype.destinations = function(cb){
    request.get({ url:this.privatePath2('resu/'), json:true }, cb);
}
NatbrailleClient.prototype.destinationToStream = function(id,ws,cb){
    request.get({ url:this.publicPath2('resu/'+id+"/attachment/dummy.txt")}).pipe(ws)
}
/*
NatbrailleClient.prototype.destinationToFile = function(id,name,cb){
    this.destinationToStream(id,fs.createWriteStream(name),cb);
}
*/
NatbrailleClient.prototype.removeDestination = function(id,cb){
    request.delete({url:this.privatePath2('resu/'+id),json:true},cb)
}
NatbrailleClient.prototype.configurationFormat = function(cb){
    request.get({ url:this.publicPath1('metaconfig/format'), json:true }, cb);
}
NatbrailleClient.prototype.configurations = function(cb){
    request.get({ url:this.privatePath2('metaconfig/'), json:true }, cb);
}
NatbrailleClient.prototype.configuration = function(id,cb){
    request.get({ url:this.privatePath2('metaconfig/'+id), json:true }, cb);
}
NatbrailleClient.prototype.addConfiguration  = function(configuration,cb){
    request.post( { url:this.privatePath2('metaconfig/'), json: configuration}, cb);
}
NatbrailleClient.prototype.removeConfiguration = function(id,cb){
    request.delete({url:this.privatePath2('metaconfig/'+id),json:true},cb)
}
NatbrailleClient.prototype.transcriptions = function(cb){
    request.get({ url:this.privatePath2('transcription/'), json:true }, cb);
}
NatbrailleClient.prototype.transcription = function(id,cb){
    request.get({ url:this.privatePath2('transcription/'+id), json:true }, cb);
}
NatbrailleClient.prototype.addTranscription  = function(sourceId,metaconfigurationId,transcription,cb){
    request.post( { url:this.privatePath2('transcription/'), json: {
	sourceDocumentId:sourceId,
	metaConfigurationId:metaconfigurationId,
	logLevel:2
    }}, cb)
}
NatbrailleClient.prototype.removeTranscription = function(id,cb){
    request.delete({url:this.privatePath2('transcription/'+id),json:true},cb)
}

module.exports = NatbrailleClient;
