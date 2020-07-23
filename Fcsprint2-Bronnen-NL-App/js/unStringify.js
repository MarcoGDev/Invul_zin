class unStringifyValues
{
    constructor()
    {
        
    }

    returnData(ob)
    {
        return this.loop(ob.data,(ob.keys !== undefined) ? ob.keys : [],(ob.all !== undefined) ? ob.all : false);
    }
 
    loop(data,keys,all)
    {
        var s = this,AR = [],OB = {};
         
        if(Array.isArray(data))
        {
            for(let i = 0; i < data.length; i++)
            {
                AR.push(s.loop(data[i],keys,all));
            }
            return AR;
        }
        else if(!Array.isArray(data) && typeof data !== 'string' && typeof data !== 'number' && typeof data !== 'boolean')
        {
            for(let key in data)
            {
                OB[key] = s.loop((keys.indexOf(key) > -1) ? s.convert(data[key]) : data[key],keys,(Array.isArray(data[key]) && keys.indexOf(key) > -1) ? true : all);
            }
            return OB;
        }
        else
        {
            return (all) ? s.convert(data) : data;
        }
    }
 
    convert(data)
    {
        if(/^(true|false)$/.test(data))
        {
            return JSON.parse(data);
        }
        else if(/^[-]?\d+([,\.]\d+)?$/.test(data) && typeof data === 'string')
        {
            return parseFloat(data.replace(/,/g,'.'));
        }
        else
        {
            return data;
        }
    }
}