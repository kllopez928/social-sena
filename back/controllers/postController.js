var Post = require('../models/Post');
var Post_likes = require('../models/Post_likes');
var Post_comentarios = require('../models/Post_comentarios');
var Usuario_amigo = require('../models/Usuario_amigo');
var Usuario = require('../models/Usuario');
var fs = require('fs');
var path = require('path');
const Notificacion = require('../models/Notificacion');

const create_post = async function(req,res){
    if (req.user) {
       try {
            let data = req.body;

            if(data.tipo == 'Media'){
                let img_path = req.files.media.path.split('\\')[2];
                data.media = img_path;
            }

            data.usuario = req.user.sub;
            let post = await Post.create(data);

            //Notificacion
            let amigos = await Usuario_amigo.find({usuario_origen:req.user.sub}).populate('usuario_amigo');

            for(var item of amigos){
                let descripcion = req.user.nombres.split(' ')[0] + ' ' + req.user.apellidos.split(' ')[0] + ' a creado una nueva publicación';

                await Notificacion.create({
                    tipo: 'Publicaciones',
                    descripcion,
                    usuario_interaccion: req.user.sub,
                    usuario: item.usuario_amigo._id,
                    post: post._id
                });
            }

            res.status(200).send({data:post,amigos});
       } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined,message:'No se pudo crear la publicación.'});
       }

    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_post_amigos = async function(req,res){
    if (req.user) {
        let post = [];
        let data = [];
        let limit = req.params['limit']; //2
        let amigos = await Usuario_amigo.find({usuario_origen:req.user.sub}).populate('usuario_amigo');
        let my_user = await Usuario_amigo.find({usuario_amigo: req.user.sub}).populate('usuario_amigo');

        if(my_user.length==0){
            let user = await Usuario.findById({_id:req.user.sub});
            amigos.push({
                usuario_amigo: user
            });
        }else{
            amigos.push(my_user[0]);
        }

        console.log(my_user);

        for(var item of amigos){
            console.log(item);
            if(item.usuario_amigo){
                let posts = await Post.find({usuario:item.usuario_amigo._id}).populate('usuario').sort({createdAt:-1});

                for(var subitem of posts){
                    let obj_like = await Post_likes.findOne({usuario:req.user.sub,post:subitem._id});
                    let reg_likes = await Post_likes.find({post:subitem._id});

                    let comentarios = await Post_comentarios.find({post:subitem._id,tipo:'Comentario'}).populate('usuario');

                    let arr_comentarios = [];
                    for(var replay of comentarios){
                        let respuestas = await Post_comentarios.find({reply_id:replay._id,tipo:'Respuesta'}).populate('usuario');

                        arr_comentarios.push({
                            comentario: replay,
                            respuestas: respuestas
                        });
                    }

                    post.push({
                        post: subitem,
                        like: obj_like,
                        likes: reg_likes,
                        comentarios: arr_comentarios,
                    });
                }
            }
        }

        
        
        post.sort((a, b) => {
            const nameA = new Date(a.post.createdAt).getTime(); 
            const nameB = new Date(b.post.createdAt).getTime(); 
            console.log(nameA);
            
  
            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
          
            return 0;
        });

        let idx = 0; //0 - 1 -2
        for(var item of post){
           if(idx < limit) data.push(item)
           idx++;
        }

        res.status(200).send({data:data});
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const obtener_post_img = async function(req,res){
    var img = req.params['img'];
    fs.stat('./uploads/posts/'+img, function(err){
        if(err){
            res.status(200).send({message:'No se encontró la imagen'});
        }else{
            let path_img = './uploads/posts/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const set_like_post = async function(req,res){
    if (req.user) {

        let data = req.body;
        let estado = '';
        let obj_like = await Post_likes.find({usuario:req.user.sub,post:data.post});
        
        if(obj_like.length >= 1){
            //se emitio un like
            estado = 'Eliminacion';
            await Post_likes.findByIdAndRemove({_id:obj_like[0]._id})
        }else if(obj_like.length == 0){
            //no se emitio ningun like
            estado = 'Creación';
            await Post_likes.create({
                post: data.post,
                usuario: req.user.sub
            });
        }
        
        res.status(200).send({data:estado});
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const set_comentario_post = async function(req,res){
    if (req.user) {
        let data = req.body;
        
        data.usuario = req.user.sub;
        let comentario = await Post_comentarios.create(data);

        //Notificacion
        let amigos = await Usuario_amigo.find({usuario_origen:req.user.sub}).populate('usuario_amigo');

        for(var item of amigos){
            let descripcion = req.user.nombres.split(' ')[0] + ' ' + req.user.apellidos.split(' ')[0] + ' a comentado una publicación.';

            await Notificacion.create({
                tipo: 'Comentarios',
                descripcion,
                usuario_interaccion: req.user.sub,
                usuario: item.usuario_amigo._id, //
                post: data.post
            });
        }

        //Diego a creado una publicacion

        //vincent => Diego a creado una nueva publicacion
        
        res.status(200).send({data:comentario,amigos});
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_post = async function(req,res){
    if (req.user) {
        let id = req.params['id'];

        let post = {};
        let reg_post = await Post.findById({_id:id}).populate('usuario');

        let obj_like = await Post_likes.findOne({usuario:req.user.sub,post:reg_post._id});
        let reg_likes = await Post_likes.find({post:reg_post._id});

        let comentarios = await Post_comentarios.find({post:reg_post._id,tipo:'Comentario'}).populate('usuario');

        let arr_comentarios = [];
        for(var replay of comentarios){
            let respuestas = await Post_comentarios.find({reply_id:replay._id,tipo:'Respuesta'}).populate('usuario');

            arr_comentarios.push({
                comentario: replay,
                respuestas: respuestas
            });
        }

        post = {
            post: reg_post,
            like: obj_like,
            likes: reg_likes,
            comentarios: arr_comentarios,
        }

        res.status(200).send({data:post});
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_post_usuario = async function(req,res){
    if (req.user) {

        try {
            let username = req.params['username'];

            let usuario = await Usuario.findOne({username:username});

            if(usuario){
                let posts = await Post.find({usuario:usuario._id}).populate('usuario').sort({createdAt:-1});
                let post = [];

                for(var subitem of posts){
                    let obj_like = await Post_likes.findOne({usuario:usuario._id,post:subitem._id});
                    let reg_likes = await Post_likes.find({post:subitem._id});

                    let comentarios = await Post_comentarios.find({post:subitem._id,tipo:'Comentario'}).populate('usuario');

                    let arr_comentarios = [];
                    for(var replay of comentarios){
                        let respuestas = await Post_comentarios.find({reply_id:replay._id,tipo:'Respuesta'}).populate('usuario');

                        arr_comentarios.push({
                            comentario: replay,
                            respuestas: respuestas
                        });
                    }

                    post.push({
                        post: subitem,
                        like: obj_like,
                        likes: reg_likes,
                        comentarios: arr_comentarios,
                    });
                }

                res.status(200).send({data:post});
            }else{
                res.status(200).send({data:undefined});
            }
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_photos = async function(req,res){
    if (req.user) {

        let username = req.params['username'];

        let usuario = await Usuario.findOne({username:username});
        console.log(usuario);
        if(usuario){
            let posts = await Post.find({usuario:usuario._id,tipo:'Media'}).sort({createdAt:-1});
            res.status(200).send({data:posts});
        }else{
            res.status(200).send({data:undefined});
        } 
        
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_widgets_perfil = async function(req,res){
    if (req.user) {

        let username = req.params['username'];

        let usuario = await Usuario.findOne({username:username});
        console.log(usuario);
        if(usuario){
            let posts = await Post.find({usuario:usuario._id,tipo:'Media'}).limit(4).sort({createdAt:-1});
            let amigos = await Usuario_amigo.find({usuario_origen:usuario._id}).populate('usuario_amigo').sort({createdAt:-1});
            res.status(200).send({data:true,posts,amigos});
        }else{
            res.status(200).send({data:undefined});
        } 
        
    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const get_notificaciones = async function(req,res){
    if (req.user) {

        let notificaciones = await Notificacion.find({usuario:req.user.sub, estado: false}).limit(10).sort({createdAt:-1}).populate('usuario_interaccion');
        res.status(200).send({data:notificaciones});

    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

const set_estado_notificacion = async function(req,res){
    if (req.user) {

        let id = req.params['id'];

        let notificacion = await Notificacion.findByIdAndUpdate({_id:id},{
            estado: true
        })

        res.status(200).send({data:notificacion});

    } else {
        res.status(403).send({message: 'NoAccess'}); 
    }
}

module.exports = {
    create_post,
    get_post_amigos,
    obtener_post_img,
    set_like_post,
    set_comentario_post,
    get_post,
    get_post_usuario,
    get_photos,
    get_widgets_perfil,
    get_notificaciones,
    set_estado_notificacion
}