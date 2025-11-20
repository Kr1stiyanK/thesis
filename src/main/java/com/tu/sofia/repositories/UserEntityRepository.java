package com.tu.sofia.repositories;

import com.tu.sofia.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByName(String name);

    @Query("SELECT u FROM UserEntity u JOIN UserRoleEntity r ON u.role.id = r.id WHERE r.role <> 'ADMIN'")
    List<UserEntity> findAllNonAdminUsers();
}
