const db = require("./conndb.js");

class Get {
    async signin(client, req_body) {
        const { user, password } = req_body;
        const name = user.split("@")[0];
        const unum = user.split("@")[1];
        let sql = `SELECT u.id userid, u.name name, s.id sellerid, s.unum unum, s.name sellername FROM "User" u `;
        sql += `LEFT JOIN seller s ON s.id = u.sellerid `;
        sql += `WHERE s.unum=$1 AND u.name=$2 AND u.password=$3 AND disabled=$4 `;
        const params = [unum, name, password, 0];
        const result = await client.query(sql, params);
        return result.rows;
    }
}

module.exports = Get;
