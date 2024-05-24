const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const FACEBOOK_APP_ID = '1167098831407158'; // Thay thế bằng App ID của bạn
const FACEBOOK_APP_SECRET = 'cf7a2eb232680b2db55709918fcc95fd'; // Thay thế bằng App Secret của bạn

// Thêm endpoint cho đường dẫn gốc
app.get('/', (req, res) => {
    res.send(`
        <html>
        <body>
            <h1>Welcome to My App</h1>
            <a href="/auth">Login with Facebook</a>
        </body>
        </html>
    `);
});

app.get('/auth', (req, res) => {
    console.log('Received request on /auth');
    const redirectUri = 'http://localhost:3000/callback';
    const authUrl = `https://www.facebook.com/v9.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=public_profile,email`;
    console.log('Redirecting to:', authUrl);
    res.redirect(authUrl);
});

app.get('/callback', (req, res) => {
    console.log('Received request on /callback');
    const code = req.query.code;
    const redirectUri = 'http://localhost:3003/callback';
    const accessTokenUrl = `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`;

    request(accessTokenUrl, (error, response, body) => {
        if (error) {
            console.error('Error requesting access token:', error);
            return res.status(500).send('Error requesting access token');
        }

        const accessToken = JSON.parse(body).access_token;
        const userInfoUrl = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,link`;

        request(userInfoUrl, (error, response, body) => {
            if (error) {
                console.error('Error requesting user info:', error);
                return res.status(500).send('Error requesting user info');
            }

            const userInfo = JSON.parse(body);
            console.log('User info received:', userInfo);
            // Lưu thông tin người dùng vào cơ sở dữ liệu ở đây
            res.send(`Helu ${userInfo.name} . Tôi có link fb của bạn rùi =V : ${userInfo.link} . Tôi sẽ add friend ngay +V. bạn có muốn tôi ib k =V`);
        });
    });
});

app.listen(3003, () => {
    console.log('Server is running on port 3000');
});
