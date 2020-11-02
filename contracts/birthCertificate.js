var contract = require("node-constants")(exports);

contract({
    contractName: 'birthCertificate',
    fileData: `pragma solidity ^0.4.24;

    contract birthCertificate{
        
      address public  owner;
      address private nurse;
      address private haad_offical; 
      
      string  public  notification_id;
      string  public  baby_name_en;
      string  private baby_name_ar;
      string  private hospital_born;
      string  private applicant_name;
      string  private telephone;
      string  private address_area;
  
      
      string private emirates_id;
      string private relationship;
      string  private number_of_fetus;
      string public  status;
      string private approve;
      string private date_of_birth;
        
        
        // constructor initialize contract upon deployment
        
        constructor(address owner1, string baby_name_en1, string baby_name_ar1, string hospital_born1, string applicant_name1, string telephone1, string emirates_id1, string relationship1, string address_area1, address nurse1, string status1, string notification_id1) public{
          owner = owner1;
          baby_name_en = baby_name_en1;
          baby_name_ar = baby_name_ar1;
          hospital_born = hospital_born1;
          applicant_name = applicant_name1;
          telephone= telephone1;
          emirates_id=emirates_id1;
          relationship=relationship1;
          address_area=address_area1;
          nurse = nurse1;
          status=status1;
          notification_id=notification_id1;
       }
         
         // set functions
          function nurseUpdate(string number_of_fetus1, string date_of_birth1, string status1, address haad_offical1) public{
              if(owner!=msg.sender) revert();
              number_of_fetus= number_of_fetus1;
              date_of_birth = date_of_birth1;
              status = status1;
              owner= haad_offical1;
          }
        
          function HAADApprovel(string approvel1, string status1, address owner1) public{
              if(owner!=msg.sender) revert();
              approve = approvel1;
              status = status1;
              owner = owner1;
          }
        
      function getInfo() public view returns (address, address, string, string, string){
          return (owner, nurse, emirates_id, status, relationship);
      }
      
      function getInfo1() public view returns (string, string, string, string, string, string, string){
          return (baby_name_en, baby_name_ar, hospital_born, applicant_name, telephone, address_area, notification_id);
      }
        
      function getBabyNameEN()public view returns(string){
        return baby_name_en;
    }
  
    function getBabyNameAR()public view returns(string){
        return baby_name_ar;
    }
      
      function getNumberOfFetus()public constant returns(string){
          return number_of_fetus;
      }
      
      function getEmiratesId()public constant returns(string){
          return emirates_id;
      }
      
      function getRelationship()public constant returns(string){
          return relationship;
      }
    }`
});
