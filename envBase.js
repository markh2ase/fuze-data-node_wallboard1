const WARDEN_TOKEN = process.env.WARDEN_TOKEN;


this.authorization=function(_env)
{
	if (_env === "PROD")
	{
		return("Bearer " + WARDEN_TOKEN);
	}
};

this.url=function(_env)
{
	if (_env === "PROD")
	{
		return ("https://rest.data-stage.fuze.com/");
	}
};

this.headers=function(_env)
{
	return (
		{
			"Authorization": this.authorization(_env),
			"Content-Type" : "application/json",
			"cache-control": "no-cache"
		}
	);
};
