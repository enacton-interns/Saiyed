const fsPromises=require('fs').promises
const path =require('path')
const data ={
  projects: require("../model/project.json"),
  setProjects: function (data){
    this.projects = data;
  },
}

const getAllProjects =  (req,res) =>{
   const user = req.user;
   const userProjects = data.projects.filter((p) => p.user === user);
   res.json(userProjects);
}
const createProject = async (req, res) => {
  const newProject = {
    id: data.projects?.length
      ? data.projects[data.projects.length - 1].id + 1
      : 1,
    name: req.body.name,
    user: req.user,
    description: req.body.description,
    status: req.body.status || "In Progress",
    createdAt: new Date(),
  };

  if (!newProject.name || !newProject.description) {
    return res
      .status(400)
      .json({ message: "Project name and description needed" });
  }
  data.setProjects([...data.projects, newProject]);
 try {
   await fsPromises.writeFile(
     path.join(__dirname, "..", "model", "project.json"),
     JSON.stringify(data.projects, null, 2)
   );
   res.status(201).json(data.projects);
   console.log(`Project created:`, newProject);
 } catch (err) {
   console.error("Error writing to file:", err);
   res.status(500).json({ message: "Internal server error" });
 }
};

const updateProjects = async(req,res) =>{
  const project=data.projects.find(
    (project)=>project.id === parseInt(req.body.id)
  );
  if(!project){
    return res
    .status(400)
    .json({message:`Project ID ${req.body.id} not found`});
  }
  if (req.body.name) project.name= req.body.name
  if(req.body.description) project.description= req.body.description
  if(req.body.status) project.status = req.body.status
  const filteredArray= data.projects.filter(
    (project)=>project.id!=parseInt(req.body.id)
  );
  const unsortedArray =[...filteredArray,project]
  data.setProjects(
    unsortedArray.sort((a,b)=>(a.id>b.id ? 1 : a.id<b.id ? -1 : 0))
  );
  try{
   await fsPromises.writeFile(
     path.join(__dirname, "..", "model", "project.json"),
     JSON.stringify(data.projects, null, 2)
   );
     console.log("Project updated");
    res.json(data.projects);
  
  }catch(err){
 console.error("Error writing to file:", err);
 res.status(500).json({ message: "Internal server error" });
  }
 
}

const deleteProjects = async(req,res)=>{
  const project = data.projects.find(
    (project) => project.id === parseInt(req.body.id)
  );
  if(!project){
    return res.status(400)
    .json({message:`project ${req.body.id} not found`})
  }
  const filteredArray = data.projects.filter(
    (project)=> project.id !== parseInt(req.body.id)
  );
  data.setProjects([...filteredArray])
  try{
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "project.json"),
      JSON.stringify(data.projects, null, 2)
    );
     console.log(data.projects)
     res.json(data.projects)
  }catch(err){
    console.error("Error writing to file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports ={
  getAllProjects,
  createProject,
  updateProjects,
  deleteProjects

}