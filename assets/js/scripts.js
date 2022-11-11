/**
 * DOCU: v88 Query, a light-weight jQuery alternative written on the spot by Jadee Ganggangan
 */
let v88 = (element_selector) => {
  let self = (typeof element_selector === "string") ? document.querySelector(element_selector) : element_selector;
  return {
    ...self,
    get: () => {
      return self;
    },
    find: (element) =>{
      return v88(self.querySelector(element));
    },
    on: (event_name, callback = null) => {
      self.addEventListener(event_name, (event) =>{
        callback(event);
      });
    },
    addClass: (class_name)=>{
      self.classList.add(class_name);
      return self;
    },
    removeClass: (class_name)=>{
      self.classList.remove(class_name);
      return self;
    },
    duplicate: () => {
      let cloned_element = self.cloneNode(true);
      return v88(cloned_element);
    },
    text: (text_content) => {
      self.innerText = text_content;
    }
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  let login_form = v88("#login_form");
  let signup_form = v88("#signup_form");
  let write_post_form = v88("#write_post_form");
  login_form.get() && login_form.on("submit", submitUserForm);
  signup_form.get() && signup_form.on("submit", submitUserForm);
  write_post_form.get() && write_post_form.on("submit", submitWritePostForm);

  /**
   * DOCU: Handles validation for login and signup user forms
   * Triggered by: login_form.on("submit", submitUserForm)
   * signup_form.on("submit", submitUserForm)
   * @param {*} event 
   */
  function submitUserForm(event){
    event.preventDefault();
    let user_form = v88(event.target);
    let user_form_data = new FormData(event.target);
    let allow_user_login = true;
    let user_password = "";
    v88(".error_field").get() && v88(".error_field").removeClass("error_field");
    v88(".error_message").get() && v88(".error_message").text("");

    /** Check the value of the form fields */
    for(let [field_name, field_value] of user_form_data){
      if(!field_value.length){
        /* Adding a class to the element with the class name of the field name. */
        user_form.find("."+ field_name).addClass("error_field");
        allow_user_login = false;
      }else{
        /** Store password value for comparison */
        if(field_name === "password"){
          user_password = field_value;
        }

        /** Compare password and confirm_password */
        if(field_name === "confirm_password" && user_password !== field_value){
          user_form.find("."+ field_name).addClass("error_field");
          user_form.find(".password").addClass("error_field");

          v88(".error_message").text("Passwords do not match");
          allow_user_login = false;
        }
      }
    }

    /** If no errors found, redirect user */
    if(allow_user_login){
      window.location = "wall.html"
    }
  };

  /**
   * DOCU: Write a post then append it to the view
   * Triggered by: write_post_form.on("submit", submitWritePostForm)
   * @param {*} event 
   */
  function submitWritePostForm(event){
    event.preventDefault();
    let post_form = v88(event.target);
    let post_content_value = post_form.find("#post_content").get().value;

    /** Check if post textarea has content */
    if(post_content_value.length){
      let post_item_clone = v88(".post_item_clone").duplicate();
      post_item_clone.removeClass("post_item_clone");

      post_item_clone.find(".post_content").text(post_content_value);
      post_item_clone.find(".comment_form").on("submit", submitCommentForm);
      post_item_clone.find(".remove_post_btn").on("click", confirmRemovePost);

      /** Append post item to view */
      v88("#posts_list").get().appendChild(post_item_clone.get());
      post_form.get().reset();
    }
  }

  /**
   * DOCU: Write a post comment then append it after its respective post
   * Triggered by: post_item_clone.find(".comment_form").on("submit", submitCommentForm)
   * comment_item_clone.find(".comment_form").on("submit", submitCommentForm)
   * @param {*} event 
   */
  function submitCommentForm(event){
    event.preventDefault();
    let comment_reply_form = v88(event.target);
    let comment_content_value = comment_reply_form.find(".comment_content").get().value;

    if(comment_content_value.length){
      let parent_post_item = v88(comment_reply_form.get().parentNode);
      let target_clone_element = (parent_post_item.find(".remove_post_btn").get()) ? ".comment_item_clone" : ".comment_reply_item_clone";
      let comment_item_clone = v88(target_clone_element).duplicate();

      comment_item_clone.removeClass("comment_item_clone");
      comment_item_clone.removeClass("comment_reply_item_clone");

      comment_item_clone.find(".comment_content").text(comment_content_value);
      parent_post_item.find(".comments_list").get().appendChild(comment_item_clone.get());
      comment_item_clone.find(".comment_form").on("submit", submitCommentForm);

      comment_reply_form.get().reset();
    }
  }

  /**
   * DOCU: Confirm with user to remove a post
   * Triggered by: post_item_clone.find(".remove_post_btn").on("click", confirmRemovePost)
   * @param {*} event 
   */
  function confirmRemovePost(event){
    event.preventDefault();
    let remove_btn = v88(event.target);
    let target_post_item = remove_btn.get().parentNode;
    let confirm_delete_post = confirm("Do you wish to remove this post?");

    if(confirm_delete_post){
      target_post_item.remove();
    }
  }

  /** THANK YOU FOR WATCHING!!! */
});