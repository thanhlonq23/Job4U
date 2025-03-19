package com.nguyenlonq23.job4userver.utils;

import java.util.function.Consumer;

public class UpdateUtil {

    public static void updateFieldIfNotEmpty(String newValue, Consumer<String> setter) {
        if (newValue != null && !newValue.isEmpty()) {
            setter.accept(newValue);
        }
    }
}
