const request_url = require("supertest")("https://kasir-api.belajarqa.com");
const assert = require("chai").expect;

// Regitrasi
describe("Registation Testing", function () { 
  it("sukses registrasi", async function () { // TEST CASE
    let random_email = Math.random().toString(36).substring(7); 
    // console.log(random_email)
    const response = await request_url 
      .post("/registration")
      .send({ email: random_email + "@gmail.com", password: random_email, name: random_email }); 

    const hasil_response = response.body; 

    assert(response.body.status).to.eql('success');
    assert(response.body.message).to.eql('berhasil didaftarkan');
    assert(hasil_response).to.include.keys("data", "message", "status"); 
    
  });

  it("verifikasi gagal registrasi pass kosong", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/registration")
      .send({ email: random_email + "@gmail.com", password: "", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql("fail");
    assert(response.status).to.eql(400);
    assert(response.body.message).to.eql('\"password\" tidak boleh kosong');
  });

  it("verifikasi gagal registrasi email kosong", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/registration")
      .send({ email: "", password: "abrarhafidz", name: random_email });
    const hasil_response = response.body;
    assert(response.body.status).to.eql("fail");
    assert(response.status).to.eql(400);
    assert(response.body.message).to.eql('\"email\" tidak boleh kosong');
  });

  it("verifikasi gagal registrasi email invalid", async function () {
    let random_email = Math.random().toString(36).substring(7);
    const response = await request_url
      .post("/registration")
      .send({ email: "123", password: random_email, name: random_email });
    
    assert(response.body.status).to.eql("fail");
    assert(response.status).to.eql(400);
    assert(response.body.message).to.eql('\"email\" must be a valid email');
  });

});

var userID = {}
  describe("Users Testing", function () { 
      it("Success Create User", async function () { 
        const response = await request_url 
          .post("/users")
          .set('Authorization', `Bearer ${token}`)
          .send({ name: "ade", email: "abrar@gmail.com", password: "abrar"});
          
          assert(response.status).to.eql(201);
          userID =response.body.data.userId
         
      }); 
      it("Create User tapi nama kosong", async function () { 
        const response = await request_url 
          .post("/users")
          .set('Authorization', `Bearer ${token}`)
          .send({ name: "", email: "udin@gmail.com", password: "12345"});

          assert(response.status).to.eql(400);
          assert(response.body.status).to.eql('fail');
          // assert(response.body.message).to.eql('name\" is not allowed to be empty');
      });
      it("Success Update User", async function () { 
        const response = await request_url 
          .put(`/users/${userID}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: "sandi", email: "abrarhafidz78@gmail.com", password: "123456"});
            
          assert(response.body.status).to.eql('success');
          assert(response.status).to.eql(200);
      });

      it("Success Delete User", async function () { 
        const response = await request_url 
          .delete(`/users/${userID}`)
          .set('Authorization', `Bearer ${token}`)
      
          assert(response.body.status).to.eql('success');
          assert(response.status).to.eql(200);
      });
        
});

// login
var token = {}
describe("Login Testing", function () { 
    it("Success Login", async function () { // TEST CASE
      const response = await request_url 
        .post("/authentications")
        .send({ email: "tugas@gmail.com", password: "tugas" }); 
  
      const hasil_response = response.body; 
      
      assert(response.status).to.eql(201);
      assert(response.body.status).to.eql('success');
      assert(response.body.message).to.eql('Authentication berhasil ditambahkan');
      token =response.body.data.accessToken
      
    });

      it("gagal login email salah", async function () { // TEST CASE
        const response = await request_url 
          .post("/authentications")
          .send({ email: "asal@gmail.com", password: "tugas" }); 
    
        const hasil_response = response.body; 
        
        assert(response.status).to.eql(401);
        assert(response.body.status).to.eql('fail');
        assert(response.body.message).to.eql("email Anda salah");
        
      });

      it("gagal login pass salah", async function () { // TEST CASE
        const response = await request_url 
          .post("/authentications")
          .send({ email: "tugas@gmail.com", password: "asal" }); 
    
        const hasil_response = response.body; 
        
        assert(response.status).to.eql(401);
        assert(response.body.status).to.eql('fail');
        assert(response.body.message).to.eql("password Anda salah");
       
      });


      it("Verify Failed Login with empty Body", async function () { 
        const response = await request_url 
          .post("/authentications")
          .send({ });
    
          assert(response.status).to.eql(400);
          assert(response.body.status).to.eql('fail');
        
      });
});