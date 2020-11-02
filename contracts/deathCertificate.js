var contract = require("node-constants")(exports);

contract({
    contractName: 'deathCertificate',
    fileData: `pragma solidity ^0.4.24;

    contract deathCertificate{
        
      address public  owner;
      address private physician;
      address private mortery;
      address private haad_offical; 
      
      string  public  notification_id;
      string public late_name_en;
      string private late_name_ar;
      string private emirates_id;
      string private nationality;
      string private martial_status;
      string private family_name;
      
      string private a;
      
      bytes32 public  status;
      bytes10 private approve;
      
      // constructor initialize contract upon deployment
       constructor(address owner1, string notification_id1, string late_name_en1, string late_name_ar1, string emirates_id1, string nationality1, string martial_status1, string family_name1) public{
          owner = owner1;
          notification_id = notification_id1;
          late_name_en = late_name_en1;
          late_name_ar = late_name_ar1;
          emirates_id = emirates_id1;
          nationality = nationality1;
          martial_status = martial_status1;
          family_name = family_name1;
       }
       
       // set functions for Physician
          function physicianUpdate(string a1, address mortery1) public{
              
              if(owner!=msg.sender) revert();
              a = a1;
              owner = mortery1;
          }
          
          // set functions for Mortery
          function MorteryUpdate(bytes32 status1, address owner1) public{
              if(owner!=msg.sender) revert();
              status = status1;
              owner = owner1;
          }
          
          // set functions for HAAD
          function HAADApprovel(bytes10 approvel1, bytes32 status1, address owner1) public{
              if(owner!=msg.sender) revert();
              approve = approvel1;
              status = status1;
              owner = owner1;
          }
          
          function getLateNameEN()public view returns(string){
            return late_name_en;
          }
          
          function getValues()public view returns(string){
            return a;
          }

    }`
});
