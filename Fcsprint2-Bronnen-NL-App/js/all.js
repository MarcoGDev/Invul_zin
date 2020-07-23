class all
{
	constructor()
	{
        this.URL = 'https://test.diglin.eu';
        this.getName = new RegExp(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/);
        this.unstring = new unStringifyValues();
	}

	id(t)
    {
        var ar = ($(t).attr('id') !== undefined) ? $(t).attr('id').split('_') : t.split('_');
        var ar2 = [];
        for(let i = 1; i < ar.length; i++)
        {
            ar2.push(parseInt(ar[i]));
        }
        if(ar2.length < 2)
        {
            return ar2[0];
        }
        else
        {
            return ar2;
        }
    }
}
