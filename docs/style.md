
# Coding style guide

I am definitely following the [angular style guide](https://angular.io/guide/styleguide) . Here are a few more details specific to the project.

## Nomenclature

### Modules

**Do** use the singular form cause they represent an entity/domain: rule, search, contact, admin, client, customer, etc.

**Consider** using the plural form if there is a good reason to not follow the previous rule.

**Why?** It is clearer and less confusing, it avoids wondering every time for names and paths whether there is an 's' or not.

### Model

**Do** use the 'model' literal to represent entities. For technical reasons, I put all models in `core/model`. Putting them in the core module is logic cause they might be used in several feature modules.

**Why?** This is logic as we are already following angular style guide for components, services, etc. The idea is to identify quickly what a file contains.
It is tolerated to create its own namespace when that makes sense. I think the entity is a strong type of object in any app. Plus, we will have more than one.

### Mocks

**Do** suffix the name with '-mock'.

Mocks reside in their own module. There is one mock file per model containing a local memory database of entities for that model.

**Why?** So we can identify and locate them quickly.
